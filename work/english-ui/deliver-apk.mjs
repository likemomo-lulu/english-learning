import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
import { chapters, getLesson } from './src/data.js';

// Deliver only the APK whose embedded page exactly matches the reviewed build.
const buildRoot = new URL('./android/app/build/outputs/apk/debug/', import.meta.url);
const metadata = JSON.parse(await readFile(new URL('output-metadata.json', buildRoot), 'utf8'));
const artifact = metadata.elements[0];
const apk = new URL(artifact.outputFile, buildRoot);
const config = JSON.parse(execFileSync('unzip', ['-p', apk.pathname, 'assets/capacitor.config.json'], { encoding: 'utf8' }));
assert.equal(config.appId, metadata.applicationId);
assert(!config.server?.url, 'APK must not depend on an external development server');
const embedded = execFileSync('unzip', ['-p', apk.pathname, 'assets/public/index.html'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
assert.equal(embedded, await readFile(new URL('./dist/index.html', import.meta.url), 'utf8'));
assert.equal(chapters.length, 37);
// Derive delivery counts from the same registry that supplies the bundled page.
const chapterCounts = {
  daily: chapters.filter(chapter => chapter.id.startsWith('D')).length,
  travel: chapters.filter(chapter => chapter.id.startsWith('T')).length,
  workplace: chapters.filter(chapter => chapter.id.startsWith('W')).length,
  total: chapters.length,
};
let quickReferenceEntries = 0;
for (const chapter of chapters) {
  const { code } = await transform(JSON.stringify(chapter.title), { charset: 'ascii', minify: true });
  assert(embedded.includes(code.trim().replace(/;$/, '')), `Chapter missing from APK: ${chapter.id}`);
  const references = getLesson(chapter).quickReference;
  assert.equal(references.length, 6, `Incomplete quick reference: ${chapter.id}`);
  for (const entry of references) {
    const { code: referenceCode } = await transform(JSON.stringify(entry.en), { charset: 'ascii', minify: true });
    assert(embedded.includes(referenceCode.trim().replace(/;$/, '')), `Quick reference missing from APK: ${entry.id}`);
  }
  quickReferenceEntries += references.length;
}
const contents = await readFile(apk);
const sha256 = createHash('sha256').update(contents).digest('hex');
const output = new URL('../../outputs/', import.meta.url);
const filename = `scene-english-${artifact.versionName}-${metadata.variantName}.apk`;
await copyFile(apk, new URL(filename, output));
assert.equal(createHash('sha256').update(await readFile(new URL(filename, output))).digest('hex'), sha256);
await writeFile(new URL('android-build-info.json', output), JSON.stringify({
  filename, applicationId: metadata.applicationId, versionName: artifact.versionName,
  versionCode: artifact.versionCode, variant: metadata.variantName,
  minimumAndroidApi: metadata.minSdkVersionForDexing,
  builtAt: new Date().toISOString(), bytes: contents.length, sha256,
  chapters: chapterCounts, quickReferenceEntries,
  bundledPageMatchesBuild: true, externalDevelopmentServer: false,
  previousNativeRuntimeValidation: { versionName: '0.2.0', androidApi: 32, offlineOnEmulator: true },
  testedOnEmulatorThisVersion: false, testedOnUserPhone: false,
}, null, 2) + '\n');
await writeFile(new URL(`${filename}.sha256`, output), `${sha256}  ${filename}\n`);
console.log(JSON.stringify({ filename, bytes: contents.length, sha256, bundledChapters: chapters.length }, null, 2));
