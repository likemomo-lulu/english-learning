import { build } from 'esbuild';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';

// Exercise bridge contracts with controllable promises; this is not a device audio test.
const calls = [];
const bridge = {
  Capacitor: { isNativePlatform: () => true },
  TextToSpeech: {
    getSupportedVoices: async () => ({ voices: [
      { lang: 'zh-CN', voiceURI: 'zh' },
      { lang: 'en-US', voiceURI: 'us', localService: true },
      { lang: 'en-GB', voiceURI: 'gb', localService: false },
    ] }),
    stop: async () => { calls.push('stop'); },
    isLanguageSupported: async () => ({ supported: true }),
    speak: async options => { calls.push(options); },
  },
  Filesystem: { writeFile: async options => { calls.push(options); return { uri: 'file:///cache/records.json' }; } },
  Directory: { Cache: 'CACHE' }, Encoding: { UTF8: 'UTF8' },
  Share: { share: async options => { calls.push(options); } },
};
const output = await build({
  entryPoints: ['src/native-services.js'], bundle: true, write: false, format: 'cjs',
  plugins: [{ name: 'mock-native-bridge', setup(builder) {
    builder.onResolve({ filter: /^@capacitor/ }, args => ({ path: args.path, namespace: 'mock' }));
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: Object.keys(bridge).map(key => `export const ${key} = bridge.${key};`).join('\n') }));
  } }],
});
const module = { exports: {} };
runInNewContext(output.outputFiles[0].text, { module, exports: module.exports, bridge, console, Date });
const service = module.exports;
assert.equal(service.isNative, true);
const voices = await service.nativeVoices();
assert.deepEqual(Array.from(voices, voice => voice.nativeIndex), [1, 2]);
await service.nativeSpeak('Hello.', voices[0], 0.75, () => true);
assert.equal(calls.at(-1).voice, 1);
assert.equal(calls.at(-1).rate, 0.75);
assert.equal(calls.at(-1).queueStrategy, 0);

let finishLanguageCheck;
bridge.TextToSpeech.isLanguageSupported = () => new Promise(resolve => { finishLanguageCheck = resolve; });
let current = true;
const cancelled = service.nativeSpeak('Must not play.', voices[0], 1, () => current);
current = false;
const beforeCancel = calls.length;
finishLanguageCheck({ supported: true });
await cancelled;
assert.equal(calls.length, beforeCancel, 'Cancellation during a bridge await must prevent speech');
bridge.TextToSpeech.isLanguageSupported = async () => ({ supported: false });
await assert.rejects(service.nativeSpeak('Hello.', null, 1, () => true), /英语语音/);

let finishStop;
let stopCount = 0;
bridge.TextToSpeech.stop = () => {
  stopCount += 1;
  return stopCount === 1 ? new Promise(resolve => { finishStop = resolve; }) : Promise.resolve();
};
const firstStop = service.nativeStop();
const secondStop = service.nativeStop();
await Promise.resolve();
assert.equal(stopCount, 1, 'Stop bridge calls must not overlap');
finishStop();
await Promise.all([firstStop, secondStop]);
assert.equal(stopCount, 2);

const record = { format: 'scene-english-records', version: 1, data: { favorites: ['D02-01'] } };
await service.nativeExportRecords(record);
const [file, share] = calls.slice(-2);
assert.deepEqual(JSON.parse(file.data), record);
assert.equal(file.directory, 'CACHE');
assert.equal(file.encoding, 'UTF8');
assert.equal(share.files[0], 'file:///cache/records.json');
bridge.Filesystem.writeFile = async () => { throw new Error('Storage unavailable'); };
await assert.rejects(service.nativeExportRecords(record), /Storage unavailable/);
console.log('Passed: voice indexes, speech parameters, cancellation during language check, missing English voice, serialized stops, export payload and storage error propagation.');
