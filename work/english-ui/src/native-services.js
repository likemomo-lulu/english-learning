import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

// Native voice indexes must be retained before filtering the full engine voice list.
export const isNative = Capacitor.isNativePlatform();
export async function nativeVoices() {
  const { voices } = await TextToSpeech.getSupportedVoices();
  return voices.map((voice, index) => ({ ...voice, nativeIndex: index })).filter(voice => /^en(?:[-_]|$)/i.test(voice.lang));
}

// Serialize stop commands: a delayed stop must never cancel a subsequent sentence.
let stopping = Promise.resolve();
export function nativeStop() {
  stopping = stopping.then(() => TextToSpeech.stop()).catch(error => {
    console.warn('Native speech stop failed:', error);
  });
  return stopping;
}
export async function nativeSpeak(text, voice, rate, isCurrent) {
  const lang = voice?.lang || 'en-US';
  const { supported } = await TextToSpeech.isLanguageSupported({ lang });
  if (!isCurrent()) return;
  if (!supported) throw new Error('手机未安装可用的英语语音，请在系统文字转语音设置中安装英语音色。');
  await TextToSpeech.speak({ text, lang, rate, pitch: 1, volume: 1, ...(voice ? { voice: voice.nativeIndex } : {}), queueStrategy: 0 });
}

// Cache files can be shared through Android's chooser without broad storage permissions.
export async function nativeExportRecords(record) {
  const filename = `scene-english-records-${Date.now()}.json`;
  const { uri } = await Filesystem.writeFile({ path: filename, directory: Directory.Cache, data: JSON.stringify(record, null, 2), encoding: Encoding.UTF8 });
  await Share.share({ title: '日常英语学习记录', files: [uri] });
}
