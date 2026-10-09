import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash, webcrypto } from 'node:crypto';
import { bundledContent } from './src/bundled-content.js';
import { validateContent, validateManifest } from './src/content-format.js';
import { downloadContent, loadContent } from './src/content-store.js';

const manifest = JSON.parse(await readFile(new URL('../../content/manifest.json', import.meta.url)));
const raw = await readFile(new URL(`../../content/${manifest.file}`, import.meta.url));
const pack = JSON.parse(raw);
const expectedHash = createHash('sha256').update(raw).digest('hex');
assert.equal(manifest.sha256, expectedHash);
assert.equal(manifest.bytes, raw.length);
validateManifest(manifest);
validateContent(pack, bundledContent);

function storage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), value: data };
}
function response(body, status = 200) {
  const bytes = new TextEncoder().encode(body);
  return { ok: status >= 200 && status < 300, status, headers: new Headers({ 'content-length': String(bytes.length) }), body: new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }) };
}
const fetcher = async url => url.includes('manifest.json?check=') ? response(JSON.stringify(manifest)) : response(raw);
const current = { ...bundledContent, revision: manifest.revision - 1 };
const saved = storage();
const updated = await downloadContent(current, { fetcher, storage: saved, cryptoApi: webcrypto, baseUrl: 'https://example.test/', signal: undefined });
assert.equal(updated.updated, true);
assert.equal(JSON.parse(saved.value.get('scene-english-content-v1')).revision, manifest.revision);
const unchanged = await downloadContent(updated.content, { fetcher: async () => response(JSON.stringify(manifest)), storage: saved, cryptoApi: webcrypto, baseUrl: 'https://example.test/' });
assert.equal(unchanged.updated, false);
await assert.rejects(() => downloadContent(current, { fetcher: async url => url.includes('manifest') ? response(JSON.stringify(manifest)) : response(`${raw}tampered`), storage: storage(), cryptoApi: webcrypto, baseUrl: 'https://example.test/' }), /完整性校验失败/);
const fallback = loadContent(bundledContent, storage({ 'scene-english-content-v1': '{"broken":true}' }));
assert.equal(fallback.content.revision, bundledContent.revision);
const offline = async () => { throw new TypeError('offline'); };
const snapshot = saved.getItem('scene-english-content-v1');
await assert.rejects(() => downloadContent(current, { fetcher: offline, storage: saved, baseUrl: 'https://example.test/' }), /offline/);
assert.equal(saved.getItem('scene-english-content-v1'), snapshot);
await assert.rejects(() => downloadContent(current, { fetcher: async () => response('', 503), storage: saved, baseUrl: 'https://example.test/' }), /HTTP 503/);
await assert.rejects(() => downloadContent(current, { fetcher, storage: { setItem() { throw new Error('quota'); } }, cryptoApi: webcrypto, baseUrl: 'https://example.test/' }), /内容保存失败/);
assert.throws(() => validateManifest({ ...manifest, minReaderVersion: 2 }), /新版 App/);
assert.throws(() => validateManifest({ ...manifest, file: 'https://example.test/script.js' }), /下载地址/);
assert.throws(() => validateContent({ ...pack, chapters: pack.chapters.slice(1) }, bundledContent), /缺少原章节/);
const noSentence = structuredClone(pack);
noSentence.chapters[0].lines[0].id = 'D01-S99';
assert.throws(() => validateContent(noSentence, bundledContent), /例句引用|缺少原句编号/);
const duplicate = structuredClone(pack);
duplicate.chapters[0].lines[1].id = duplicate.chapters[0].lines[0].id;
assert.throws(() => validateContent(duplicate), /句子编号/);
const cancelled = new AbortController();
cancelled.abort();
await assert.rejects(() => downloadContent(current, { fetcher, storage: saved, cryptoApi: webcrypto, baseUrl: 'https://example.test/', signal: cancelled.signal }), { name: 'AbortError' });
assert.equal(saved.getItem('scene-english-content-v1'), snapshot);
const newer = { ...pack, revision: pack.revision + 1 };
assert.equal(loadContent(bundledContent, storage({ 'scene-english-content-v1': JSON.stringify(newer) })).content.revision, newer.revision);
const fallbackResult = await downloadContent(current, {
  sources: ['https://primary.test/', 'https://alternate.test/'], storage: storage(), cryptoApi: webcrypto,
  fetcher: async url => url.startsWith('https://primary.test/') ? response('', 503) : fetcher(url),
});
assert.equal(fallbackResult.updated, true);
let requests = 0;
await assert.rejects(() => downloadContent(current, {
  sources: ['https://primary.test/', 'https://alternate.test/'], storage: storage(), cryptoApi: webcrypto,
  fetcher: async url => { requests++; return url.includes('manifest') ? response(JSON.stringify(manifest)) : response('corrupt'); },
}), /完整性校验失败/);
assert.equal(requests, 2, 'Corrupt content must not be hidden by retrying another source');
console.log('Passed content checks: update, no-op/downgrade, offline cache, corrupted cache, HTTP/network errors, quota failure, hash/size tampering, incompatible reader, fixed paths, preserved IDs, duplicate IDs and cancellation.');
