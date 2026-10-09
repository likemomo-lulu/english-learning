import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import { chapters } from './src/data.js';

const execute = promisify(execFile);
// Follow the current catalog when checking the installed APK's category counts.
const dailyCount = chapters.filter(chapter => chapter.id.startsWith('D')).length;
const travelCount = chapters.filter(chapter => chapter.id.startsWith('T')).length;
const workCount = chapters.filter(chapter => chapter.id.startsWith('W')).length;
// Attach to the installed APK's WebView; do not navigate to the desktop preview.
async function run(...args) {
  const { stdout } = await execute('agent-browser', ['--session', 'english-android', ...args], { maxBuffer: 2 * 1024 * 1024 });
  return stdout.trim();
}
async function read(fn) {
  const result = JSON.parse(await run('--json', 'eval', '-b', Buffer.from(`(${fn.toString()})()`).toString('base64')));
  assert(result.success, result.error);
  return result.data.result;
}
const snapshot = () => run('snapshot', '-i');
if (await run('get', 'url') !== 'https://localhost/#D02') await run('open', 'https://localhost/#D02');
assert.equal(await run('get', 'url'), 'https://localhost/#D02');
assert.equal(await read(() => window.Capacitor.getPlatform()), 'android');
await snapshot();
if (!await read(() => Boolean(document.querySelector('.sentence:first-child .bookmarked')))) {
  await run('click', '.sentence:first-child [aria-label="收藏句子"]');
}
await snapshot();
await run('reload');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.learned, .mark-learned, .lesson-progress').length), 0);
assert(await read(() => Boolean(document.querySelector('.sentence:first-child .bookmarked'))));
assert.equal(await read(() => document.querySelectorAll('.usage-note').length), 6);
assert(await read(() => document.documentElement.scrollWidth <= innerWidth));
await run('click', '.sentence:first-child [aria-label="播放第 1 句"]');
await run('wait', '--fn', "document.querySelector('.player-title').textContent === '正在朗读'");
await snapshot();
await run('click', '.sentence:nth-child(2) [aria-label="播放第 2 句"]');
await run('wait', '--fn', "document.querySelector('.player-title').textContent === '顺序播放'");
assert.equal(await read(() => document.querySelector('.player-counter').textContent.replace(/\s/g, '')), '02/12');
assert.equal(await read(() => document.querySelector('.toast')?.textContent || ''), '');
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '顺序播放', '--exact');
await run('wait', '--fn', "document.querySelector('.player-counter').textContent.replace(/\\s/g, '').startsWith('03/')");
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '暂停播放', '--exact');
await run('wait', '--fn', "document.querySelector('.player-title').textContent === '已暂停'");
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '继续播放', '--exact');
await run('wait', '--fn', "document.querySelector('.player-title').textContent === '正在朗读'");
await snapshot();
await run('click', '[aria-label="返回章节"]');
await snapshot();
for (const [name, count] of [['日常', dailyCount], ['旅行', travelCount], ['职场', workCount], ['全部', chapters.length]]) {
  await run('find', 'role', 'button', 'click', '--name', name, '--exact');
  await snapshot();
  assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), count);
}
// Older emulator WebViews may expose hidden sidebar duplicates to semantic lookup.
await run('click', '.bottom-nav .nav-item:nth-child(3)');
await run('wait', '--fn', "Boolean(document.querySelector('[aria-label=\"英语音色\"]'))");
await snapshot();
const offlineVoices = await read(() => [...document.querySelector('[aria-label="英语音色"]').options].filter(o => o.textContent.includes('离线')).length);
assert(offlineVoices > 0, 'This emulator must have an offline voice for the offline speech check');
console.log(`Passed installed APK: Android native platform, local bundled origin, persisted bookmarked state, direct notes, no horizontal overflow, rapid speech switch and completion, continuous advancement, pause/resume, categories ${dailyCount}/${travelCount}/${workCount}/${chapters.length}, ${offlineVoices} available offline English voices. Audio quality not assessed.`);
