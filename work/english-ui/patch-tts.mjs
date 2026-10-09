import { readFile, writeFile } from 'node:fs/promises';

// Upstream 8.0.2 drops stopped requests without resolving/rejecting bridge promises.
// Keep this version-specific fix reproducible across installs, avoiding retained calls.
const root = new URL('./node_modules/@capacitor-community/text-to-speech/', import.meta.url);
const packageInfo = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
if (packageInfo.version !== '8.0.2') throw new Error('Review the TTS cancellation fix before changing the plugin version.');
const file = new URL('android/src/main/java/com/getcapacitor/community/tts/TextToSpeech.java', root);
let source = await readFile(file, 'utf8');
if (!source.includes('// Scene English: release cancelled bridge calls.')) {
  const edits = [
    ['import java.util.HashMap;', 'import java.util.concurrent.ConcurrentHashMap;'],
    ['new HashMap()', 'new ConcurrentHashMap()'],
    ...['onDone()', 'onError()'].map(event => [
      `SpeakResultCallback callback = requests.get(utteranceId);
                        if (callback != null) {
                            callback.${event};
                            requests.remove(utteranceId);
                        }`,
      `SpeakResultCallback callback = requests.remove(utteranceId);
                        if (callback != null) {
                            callback.${event};
                        }`,
    ]),
    ['        tts.speak(text, queueStrategy, ttsParams, callbackId);', `        int result = tts.speak(text, queueStrategy, ttsParams, callbackId);
        if (result == android.speech.tts.TextToSpeech.ERROR) {
            SpeakResultCallback callback = requests.remove(callbackId);
            if (callback != null) callback.onError();
        }`],
    ['        requests.clear();', `        // Scene English: release cancelled bridge calls.
        for (String requestId : requests.keySet()) {
            SpeakResultCallback callback = requests.remove(requestId);
            if (callback != null) callback.onError();
        }`],
  ];
  for (const [before, after] of edits) {
    if (!source.includes(before)) throw new Error(`TTS patch no longer matches: ${before}`);
    source = source.replaceAll(before, after);
  }
}
// Progress events must retain the callback until the terminal event arrives.
source = source.replace(
  `public void onRangeStart(String utteranceId, int start, int end, int frame) {
                        SpeakResultCallback callback = requests.remove(utteranceId);`,
  `public void onRangeStart(String utteranceId, int start, int end, int frame) {
                        SpeakResultCallback callback = requests.get(utteranceId);`,
).replaceAll('                            }\n                    }', '                        }\n                    }');
if (!source.includes('public void onRangeStart(String utteranceId, int start, int end, int frame) {\n                        SpeakResultCallback callback = requests.get(utteranceId);')) {
  throw new Error('TTS progress callbacks must be retained until completion.');
}
await writeFile(file, source);
console.log('Android TTS cancellation and immediate-error handling verified.');
