import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline';
import { bundledContent } from './src/bundled-content.js';
import { contentBaseUrl, contentSources, validateContent } from './src/content-format.js';

// This isolated preview substitutes only the update endpoint; no fixture enters an APK or GitHub.
const origin = 'http://127.0.0.1:4179';
const result = await build({
  entryPoints: ['src/app.jsx'], bundle: true, write: false, format: 'iife', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [{ name: 'local-update-fixture', setup(builder) {
    builder.onLoad({ filter: /content-format\.js$/ }, async args => ({
      contents: (await readFile(args.path, 'utf8')).replace(contentBaseUrl, `${origin}/content/`).replace(contentSources[1], `${origin}/content/`), loader: 'js',
    }));
  } }],
});
const css = await readFile(new URL('./src/style.css', import.meta.url), 'utf8');
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>教材更新验证</title><style>${css}</style><div id="root"></div><script>${result.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script></html>`;
const fixture = structuredClone(bundledContent);
fixture.revision += 1;
fixture.version = '0.5-test';
const extra = structuredClone(fixture.chapters.find(ch => ch.id === 'D32'));
// Choose the next daily ID so the fixture stays separate from newly published chapters.
const fixtureChapterId = `D${Math.max(...fixture.chapters.filter(ch => ch.id.startsWith('D')).map(ch => Number(ch.id.slice(1)))) + 1}`;
function remap(value) {
  if (Array.isArray(value)) return value.map(remap);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, ['id', 'chapterId', 'exampleId'].includes(key) ? item.replace(/^D32/, fixtureChapterId) : remap(item)]));
  return value;
}
const chapter = remap(extra);
chapter.title = '更新验证临时章节';
fixture.chapters.push(chapter);
validateContent(fixture, bundledContent);
const bytes = Buffer.from(JSON.stringify(fixture));
const original = await readFile(new URL('../../content/manifest.json', import.meta.url));
const manifest = { ...JSON.parse(original), revision: fixture.revision, version: fixture.version, file: `pack-${fixture.revision}.json`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
let mode = 'current';
createInterface({ input: process.stdin }).on('line', value => {
  if (['current', 'update', 'offline', 'tampered'].includes(value)) { mode = value; console.log(`Fixture mode: ${mode}`); }
});
const server = createServer((request, response) => {
  const path = request.url.split('?')[0];
  response.setHeader('Cache-Control', 'no-store');
  if (path === '/') { response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(html); return; }
  if (mode === 'offline') { response.writeHead(503).end('Fixture offline'); return; }
  response.setHeader('Content-Type', 'application/json');
  if (path === '/content/manifest.json') {
    setTimeout(() => response.end(mode === 'current' ? original : JSON.stringify(manifest)), 600);
    return;
  }
  if (path === `/content/${manifest.file}`) { response.end(mode === 'tampered' ? Buffer.concat([bytes, Buffer.from('tampered')]) : bytes); return; }
  response.writeHead(404).end();
});
server.listen(4179, '127.0.0.1', () => console.log(`Visible content-update fixture: ${origin}; stdin: current/update/offline/tampered`));
