import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';

// Apply the actual installer patch to a fresh upstream archive and run it twice.
let java = execFileSync('tar', ['-xOf', new URL('./tests/fixtures/capacitor-community-text-to-speech-8.0.2.tgz', import.meta.url).pathname, 'package/android/src/main/java/com/getcapacitor/community/tts/TextToSpeech.java'], { encoding: 'utf8' });
const script = (await readFile('patch-tts.mjs', 'utf8'))
  .replace("import { readFile, writeFile } from 'node:fs/promises';", '')
  .replaceAll('import.meta.url', JSON.stringify(new URL('./patch-tts.mjs', import.meta.url).href));
const context = {
  URL, console: { log() {} },
  readFile: async url => url.pathname.endsWith('package.json') ? '{"version":"8.0.2"}' : java,
  writeFile: async (url, value) => { java = value; },
};
await runInNewContext(`(async () => {${script}})()`, context);
const once = java;
await runInNewContext(`(async () => {${script}})()`, context);
assert.equal(java, once, 'Repeated installs must not alter the repaired source');
assert.match(java, /onRangeStart\(String utteranceId, int start, int end, int frame\) \{\s*SpeakResultCallback callback = requests.get\(utteranceId\)/);
for (const event of ['onDone', 'onError']) {
  assert(java.includes(`public void ${event}(String utteranceId) {\n                        SpeakResultCallback callback = requests.remove(utteranceId);`));
}
assert(!java.includes('requests.clear()'));
assert(java.includes('callback != null) callback.onError()'));
assert(java.includes('android.speech.tts.TextToSpeech.ERROR'));
assert.equal(java, await readFile('node_modules/@capacitor-community/text-to-speech/android/src/main/java/com/getcapacitor/community/tts/TextToSpeech.java', 'utf8'));
console.log('Passed: fresh upstream patch, idempotency, progress callback retention, atomic terminal callbacks, cancellation completion, and immediate native errors. Installed source matches.');
