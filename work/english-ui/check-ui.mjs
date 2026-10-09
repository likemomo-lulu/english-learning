import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import { chapters } from './src/data.js';

const execute = promisify(execFile);
const prefix = ['--session', 'english-ui'];
const output = new URL('../../outputs/english-app-ui/', import.meta.url).pathname;
// Expected catalog counts follow the same complete manuscript registry as the application.
const dailyCount = chapters.filter(chapter => chapter.id.startsWith('D')).length;
async function run(...args) {
  const { stdout } = await execute('agent-browser', [...prefix, ...args], { maxBuffer: 4 * 1024 * 1024 });
  return stdout.trim();
}
async function read(fn) {
  const response = JSON.parse(await run('--json', 'eval', '-b', Buffer.from(`(${fn.toString()})()`).toString('base64')));
  if (!response.success) throw new Error(response.error);
  return response.data.result;
}
async function snapshot() { await run('snapshot', '-i'); }
async function assertLayout() {
  const result = await read(() => {
    const width = innerWidth;
    const overflow = [...document.querySelectorAll('main button, main select, .player, .bottom-nav')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > width + 1 || r.left < -1);
    }).map(el => el.getAttribute('aria-label') || el.textContent.slice(0, 60));
    return { width, scrollWidth: document.documentElement.scrollWidth, overflow };
  });
  assert(result.scrollWidth <= result.width, `Page overflow: ${JSON.stringify(result)}`);
  assert.equal(result.overflow.length, 0, `Control overflow: ${JSON.stringify(result)}`);
  if (result.width <= 760) {
    const phone = await read(() => {
      const actions = [...document.querySelectorAll('.sentence-meta .sentence-actions .icon-button')];
      const smallTargets = actions.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
      }).length;
      const overlappingMetadata = [...document.querySelectorAll('.sentence-meta')].filter(meta => {
        const tools = meta.querySelector('.sentence-actions').getBoundingClientRect();
        return [...meta.querySelectorAll(':scope > span')].some(span => span.getBoundingClientRect().right > tools.left);
      }).length;
      const player = document.querySelector('.player');
      const nav = document.querySelector('.bottom-nav');
      const fixedOverlap = player && nav && player.getBoundingClientRect().bottom > nav.getBoundingClientRect().top + 1;
      return { smallTargets, overlappingMetadata, fixedOverlap: Boolean(fixedOverlap) };
    });
    assert.equal(phone.smallTargets, 0, 'Sentence actions must have 44px touch targets');
    assert.equal(phone.overlappingMetadata, 0, 'Sentence role or tone overlaps the tools');
    assert.equal(phone.fixedOverlap, false, 'Player overlaps the bottom navigation');
  }
}

await run('set', 'viewport', '390', '844');
await run('open', 'http://127.0.0.1:4178/');
await snapshot();
await run('click', '.bottom-nav .nav-item:first-child');
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '旅行', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), 6);
await run('find', 'role', 'button', 'click', '--name', '职场', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), 8);
await run('fill', '[aria-label="搜索章节"]', '优先级');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), 1);
await run('click', '.chapter-card');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.sentence').length), 12);
assert.equal(await read(() => document.querySelectorAll('.usage-note').length), 3);
for (const width of [320, 360, 390, 412]) {
  await run('set', 'viewport', String(width), '800');
  await assertLayout();
}
await run('set', 'viewport', '360', '800');
await run('screenshot', `${output}workplace-mobile.png`);
await run('find', 'role', 'tab', 'click', '--name', '对话练习', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.dialogue-picker button').length), 2);
assert.equal(await read(() => document.querySelectorAll('.dialogue-sentence').length), 6);
await run('find', 'role', 'tab', 'click', '--name', '场景变化', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.dialogue-sentence').length), 4);
await run('click', '[aria-label="返回章节"]');
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '日常', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), dailyCount);
await run('find', 'role', 'button', 'click', '--name', '全部', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), chapters.length);
await run('fill', '[aria-label="搜索章节"]', '超市');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.chapter-card').length), 1);
await run('fill', '[aria-label="搜索章节"]', '无匹配的内容');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.empty-state').length), 1);
await run('fill', '[aria-label="搜索章节"]', '超市');
await snapshot();
await run('click', '.chapter-card');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.sentence').length), 12);
// The isolated browser session may retain records from an earlier verification run.
if (!await read(() => Boolean(document.querySelector('.sentence:first-child .bookmarked')))) {
  await run('click', '.sentence:first-child [aria-label="收藏句子"]');
}
assert.equal(await read(() => document.querySelectorAll('.sentence-actions button').length), 24);
assert.equal(await read(() => document.querySelectorAll('.learned, .mark-learned, .lesson-progress, .chapter-progress').length), 0);
assert(await read(() => !document.querySelector('main').textContent.includes('已学')));
await snapshot();
await run('click', '[aria-label="隐藏中文"]');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.translation').length), 0);
await run('click', '[aria-label="显示中文"]');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.translation').length), 12);
assert.equal(await read(() => document.querySelectorAll('.usage-note').length), 6);
assert.equal(await read(() => document.querySelectorAll('.note-trigger').length), 0);
assert(await read(() => [...document.querySelectorAll('.sentence')].every(row => row.querySelector('.sentence-meta .sentence-actions'))));

for (const width of [320, 360, 390, 412, 768, 1280]) {
  await run('set', 'viewport', String(width), '844');
  await assertLayout();
}
await run('set', 'viewport', '390', '844');
await run('screenshot', `${output}lesson-mobile.png`);
await run('find', 'role', 'tab', 'click', '--name', '对话练习', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.dialogue-sentence').length), 6);
await run('find', 'role', 'button', 'click', '--name', '结账', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.dialogue-sentence').length), 8);
await run('find', 'role', 'tab', 'click', '--name', '场景变化', '--exact');
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '结账价格不符', '--exact');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.dialogue-sentence').length), 6);
await assertLayout();
await run('screenshot', `${output}dialogue-mobile.png`);

await run('click', '.bottom-nav .nav-item:nth-child(2)');
await snapshot();
assert(await read(() => document.querySelectorAll('.sentence').length >= 1));
await run('screenshot', `${output}favorites-mobile.png`);
await run('reload');
await snapshot();
await run('click', '.bottom-nav .nav-item:nth-child(2)');
await snapshot();
assert(await read(() => Boolean(document.querySelector('.sentence .bookmarked'))));
await run('click', '.bottom-nav .nav-item:nth-child(3)');
await snapshot();
assert(await read(() => !document.querySelector('main').textContent.includes('已学')));
await run('find', 'role', 'button', 'click', '--name', '大', '--exact');
assert.equal(await read(() => document.querySelectorAll('.reference-section, a[href*="bilibili.com"]').length), 0);
await snapshot();
await run('click', '.bottom-nav .nav-item:first-child');
await snapshot();
assert.equal(await read(() => document.querySelectorAll('.resume-example, .resume-main .eyebrow').length), 0);
assert.equal(await read(() => document.querySelectorAll('.resume-copy p[lang="en"]').length), 1);
assert.equal(await read(() => document.querySelectorAll('.catalog-heading h1, .catalog-heading .eyebrow').length), 0);
assert(await read(() => !document.querySelector('main').textContent.includes('已学')));
await run('fill', '[aria-label="搜索章节"]', '超市');
await run('click', '.chapter-card');
await snapshot();
assert.equal(await read(() => getComputedStyle(document.querySelector('.english')).fontSize), '22px');
await assertLayout();
await run('set', 'viewport', '320', '640');
await assertLayout();
await run('scroll', 'down', '10000');
assert(await read(() => document.querySelector('.sentence:last-child').getBoundingClientRect().bottom <= document.querySelector('.player').getBoundingClientRect().top), 'Last sentence must scroll clear of the fixed player');
await run('set', 'viewport', '390', '844');

await run('click', '[aria-label="学习设置"]');
await snapshot();
await run('find', 'role', 'button', 'click', '--name', '标准', '--exact');
await snapshot();
await assertLayout();
await run('screenshot', `${output}settings-mobile.png`);
await run('click', '.bottom-nav .nav-item:first-child');
await snapshot();
await run('screenshot', `${output}chapters-mobile.png`);
for (const width of [320, 360, 390, 412, 768, 1280]) {
  await run('set', 'viewport', String(width), '900');
  await assertLayout();
}
await run('set', 'viewport', '1280', '900');
await run('screenshot', `${output}chapters-desktop.png`);
const errors = await run('errors');
assert(!errors || /No errors/i.test(errors), errors);
console.log(`Passed: chapter filters (${dailyCount}/6/8/${chapters.length}), workplace search and lessons, search and empty state, Chinese toggle, direct expression notes, two inline tools, favorites persistence, removed learned controls/statistics, compact resume module without examples, font sizing, and layout at 320/360/390/412/768/1280px.`);
console.log('Browser page errors: none. Screenshots saved. Speech audio quality and Android runtime not verified.');
