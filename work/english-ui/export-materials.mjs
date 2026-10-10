import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chapters, getLesson } from './src/data.js';
import { contentVersion } from './src/content-format.js';

// Validate the shared lesson registry before exporting readable manuscripts and app data.
const output = new URL('../../outputs/english-manuscripts/', import.meta.url);
const ids = new Set();
const englishTexts = new Set();
const totals = { chapters: chapters.length, core: 0, dialogues: 0, branches: 0, sentenceEntries: 0, notes: 0, substitutions: 0, responses: 0, tasks: 0, quickReferenceEntries: 0 };
assert.equal(chapters.length, 67);
for (const [prefix, count] of [['D', 45], ['T', 9], ['W', 13]]) {
  assert.equal(chapters.filter(ch => ch.id.startsWith(prefix)).length, count);
}
assert.equal(new Set(chapters.map(ch => ch.id)).size, chapters.length);
assert.equal(chapters.filter(ch => ch.ready).length, chapters.length);
for (const chapter of chapters) {
  const lesson = getLesson(chapter);
  assert(lesson?.scenario?.trim(), `${chapter.id}: missing scenario`);
  assert.equal(lesson.lines.length, 12, `${chapter.id}: expected 12 core sentences`);
  if (chapter.id !== 'D01' && chapter.id !== 'D02' && !chapter.id.startsWith('W')) {
    assert.equal(lesson.lines[0].id, `${chapter.id}-S01`);
    assert.equal(lesson.lines[0].en, chapter.example, `${chapter.id}: original example ID changed`);
  }
  assert(lesson.dialogues.length >= 2, `${chapter.id}: expected at least two dialogues`);
  assert(lesson.branches.length >= 2, `${chapter.id}: expected at least two branches`);
  assert(lesson.phrases.length >= 6, `${chapter.id}: missing phrases`);
  assert(lesson.lines.filter(s => s.note).length >= 3, `${chapter.id}: missing expression notes`);
  for (const [kind, min, max] of [['dialogues', 6, 10], ['branches', 4, 6]]) {
    for (const section of lesson[kind]) {
      assert(section.title?.trim() && section.subtitle?.trim(), `${chapter.id}: missing section title`);
      assert(section.lines.length >= min && section.lines.length <= max, `${chapter.id}: invalid ${kind} length`);
      assert(new Set(section.lines.map(s => s.role)).size >= 2, `${chapter.id}: conversation needs two roles`);
    }
  }
  assert.equal(lesson.practice?.substitutions?.length, 3, `${chapter.id}: missing substitution tasks`);
  assert.equal(lesson.practice?.responses?.length, 3, `${chapter.id}: missing response tasks`);
  assert(lesson.practice?.task?.trim(), `${chapter.id}: missing free task`);
  for (const response of lesson.practice.responses) {
    assert.equal(response.length, 3);
    assert(response.every(text => typeof text === 'string' && text.trim()), `${chapter.id}: incomplete response prompt`);
  }
  const sentences = [...lesson.lines, ...lesson.dialogues.flatMap(d => d.lines), ...lesson.branches.flatMap(d => d.lines)];
  for (const sentence of sentences) {
    assert(!ids.has(sentence.id), `Duplicate sentence ID: ${sentence.id}`);
    assert.equal(sentence.chapterId, chapter.id, `Wrong chapter owner: ${sentence.id}`);
    assert(sentence.id.startsWith(`${chapter.id}-`), `Wrong sentence prefix: ${sentence.id}`);
    for (const field of ['en', 'zh', 'role', 'tone']) {
      assert(typeof sentence[field] === 'string' && sentence[field].trim(), `${sentence.id}: missing ${field}`);
    }
    assert(/[A-Za-z]/.test(sentence.en) && !/[\u3400-\u9fff]/.test(sentence.en), `${sentence.id}: mixed English text`);
    assert(!/待补|TODO|待编写|placeholder/i.test(`${sentence.en} ${sentence.zh}`), `${sentence.id}: placeholder text`);
    ids.add(sentence.id);
    englishTexts.add(sentence.en.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim());
  }
  assert.equal(lesson.quickReference.length, 6, `${chapter.id}: expected six quick-reference entries`);
  for (const entry of lesson.quickReference) {
    assert(!ids.has(entry.id), `Duplicate reference ID: ${entry.id}`);
    assert.equal(entry.chapterId, chapter.id);
    assert(entry.id.startsWith(`${chapter.id}-Q`));
    for (const field of ['en', 'zh', 'note', 'keyword']) assert(entry[field]?.trim(), `${entry.id}: missing ${field}`);
    assert(entry.phonetics.uk?.trim() && entry.phonetics.us?.trim(), `${entry.id}: missing checked IPA`);
    assert(entry.phonetics.source.startsWith('https://dictionary.cambridge.org/dictionary/english/'));
    const example = sentences.find(sentence => sentence.id === entry.exampleId);
    assert(example, `${entry.id}: example must belong to this chapter`);
    assert.equal(entry.exampleEn, example.en);
    assert.equal(entry.exampleZh, example.zh);
    ids.add(entry.id);
  }
  totals.quickReferenceEntries += lesson.quickReference.length;
  totals.core += lesson.lines.length;
  totals.dialogues += lesson.dialogues.length;
  totals.branches += lesson.branches.length;
  totals.sentenceEntries += sentences.length;
  totals.notes += lesson.lines.filter(s => s.note).length;
  totals.substitutions += lesson.practice.substitutions.length;
  totals.responses += lesson.practice.responses.length;
  totals.tasks += 1;
}
totals.distinctSentenceTexts = englishTexts.size;

const sourceNote = '原有日常与旅行部分参考联普英语社区、了不起的 Marianne 的场景选题方式，具体核实范围和链接见《学习材料规划》。D19–D23 生活服务章节及此前补充对话，也参考用户提供的《生活英语讲义》的主题与表达，经校对、改写和扩展；不代表已核实原视频台词。职场篇及本次新增 D24–D45、T07–T09、W09–W13 为原创情境练习。';
const groupCounts = [['D', '日常'], ['T', '旅行'], ['W', '职场']].map(([prefix, label]) => `${label} ${chapters.filter(ch => ch.id.startsWith(prefix)).length}`).join('、');
const introduction = `版本：2026-10-10 · 完整文字初稿 v${contentVersion}\n\n面向能基本交流、希望表达更自然的自学者；纯文字，无图片。共 ${totals.chapters} 章：${groupCounts}。\n\n每章含场景说明、至少 6 个词组、12 条核心句、至少 3 条核心句表达笔记、至少 2 段完整对话、至少 2 个变化分支、3 个替换练习、3 个回应练习和 1 个自由任务。每章新增独立的语句速查，含 6 个词语或表达、关键词英美音标、易错点及本章例句；不向原有句旁笔记追加音标或速查内容。练习参考不是唯一答案。\n\n${sourceNote}\n\n音标逐关键词核对剑桥词典，表示关键词的单独读音，不是整句连读音标；名词 refund、estimate、update 按名词读音标注。文字初稿已做内容自查和结构校验，尚未做母语者审校。当前 App 通过系统文字转语音点读，文稿没有独立录音音轨；实际口音由设备音色决定。金额、地名、政策和流程属于虚构练习设定，现实使用时向服务方或公司核实。\n`;
const cell = text => text.replaceAll('|', '\\|').replaceAll('\n', ' ');
// Reference examples reuse existing sentence text while dictionary sources remain traceable.
function renderReference(lesson) {
  return lesson.quickReference.map(entry => `### ${entry.en}\n\n${entry.zh}\n\n音标关键词：${entry.keyword}；英 /${entry.phonetics.uk}/；美 /${entry.phonetics.us}/\n\n易错点：${entry.note}\n\n本章例句：${entry.exampleEn}\n\n${entry.exampleZh}\n\n例句编号：${entry.exampleId}；[音标来源](${entry.phonetics.source})`).join('\n\n');
}
function renderChapter(chapter) {
  const lesson = getLesson(chapter);
  const sections = [`# ${chapter.id} ${chapter.title}`, `*${chapter.english}*`, `学习目标：${chapter.task}`, '## 场景', lesson.scenario, '## 词组', lesson.phrases.map(p => `- ${p}`).join('\n'), '## 核心句'];
  const coreTable = ['| 编号 | 角色 | 英文 | 中文 |', '| --- | --- | --- | --- |'];
  for (const line of lesson.lines) coreTable.push(`| ${line.id} | ${cell(line.role)} | ${cell(line.en)} | ${cell(line.zh)} |`);
  sections.push(coreTable.join('\n'));
  sections.push('## 表达笔记');
  lesson.lines.filter(s => s.note).forEach((s, i) => sections.push(`${i + 1}. **${s.en}**\n\n${s.note}`));
  for (const [key, label] of [['dialogues', '完整对话'], ['branches', '变化分支']]) {
    for (const [index, part] of lesson[key].entries()) {
      sections.push(`## ${label} ${index + 1}：${part.title}`, part.subtitle);
      part.lines.forEach((s, i) => sections.push(`${i + 1}. **${s.role}**：${s.en}\n\n${s.zh}${s.note ? `\n\n表达笔记：${s.note}` : ''}`));
    }
  }
  sections.push('## 语句速查', renderReference(lesson));
  sections.push('## 替换练习');
  lesson.practice.substitutions.forEach((text, i) => sections.push(`${i + 1}. ${text}`));
  sections.push('## 场景回应', '先根据中文任务自行回应，再看参考；意思清楚、符合场合的其他答案也可以。');
  lesson.practice.responses.forEach(([prompt, task, answer], i) => sections.push(`${i + 1}. 对方：${prompt}\n\n任务：${task}\n\n参考：${answer}`));
  sections.push('## 自由任务', lesson.practice.task);
  return `${sections.join('\n\n')}\n`;
}

await mkdir(output, { recursive: true });
const table = ['| 章节 | 标题 | 核心句 | 完整对话 | 变化分支 | 速查条目 |', '| --- | --- | --- | --- | --- | --- |'];
const texts = [];
for (const chapter of chapters) {
  const text = renderChapter(chapter);
  await writeFile(new URL(`${chapter.id}.md`, output), `${text}\n---\n\n${sourceNote}\n\n[学习材料规划与参考来源](../scene-english-learning-plan.md)\n\n状态：文字初稿；App 使用系统 TTS 点读，独立录音音轨尚未制作。\n`);
  const lesson = getLesson(chapter);
  table.push(`| [${chapter.id}](${chapter.id}.md) | ${chapter.title} | ${lesson.lines.length} | ${lesson.dialogues.length} | ${lesson.branches.length} | ${lesson.quickReference.length} |`);
  texts.push(text);
}
const counts = `统计：${totals.core} 条核心句、${totals.dialogues} 段对话、${totals.branches} 个分支、${totals.notes} 条核心句笔记、${totals.substitutions} 个替换练习、${totals.responses} 个回应练习、${totals.tasks} 个自由任务、${totals.quickReferenceEntries} 个速查条目。核心句、对话和分支共有 ${totals.sentenceEntries} 条句子记录，其中 ${totals.distinctSentenceTexts} 种不同英文文本；速查中的例句引用本章原句，不重复计为新句。`;
await writeFile(new URL('README.md', output), `# 场景英语文稿目录\n\n${introduction}\n[学习材料规划与参考来源](../scene-english-learning-plan.md)\n\n${counts}\n\n${table.join('\n')}\n\n建议先练 D01、D02、D04、D06、D08、D11、D13、D18；职场优先 W02、W03、W04、W06，其余按需要选学。\n`);
await writeFile(new URL('../scene-english-manuscripts.md', output), `# 场景英语完整文稿：日常、旅行与职场\n\n${introduction}\n[学习材料规划与参考来源](scene-english-learning-plan.md)\n\n${counts}\n\n---\n\n${texts.join('\n---\n\n')}`);
await writeFile(new URL('../scene-english-manuscripts.json', output), `${JSON.stringify({ version: contentVersion, date: '2026-10-10', status: 'text-draft', totals, chapters: chapters.map(chapter => ({ ...chapter, ...getLesson(chapter) })) }, null, 2)}\n`);
await writeFile(new URL('../scene-english-quick-reference.md', output), `# 场景英语：语句速查\n\n2026-10-10 · v${contentVersion} · ${totals.chapters} 章，${totals.quickReferenceEntries} 个条目。\n\n音标按关键词标注英美读音，逐项核对剑桥词典；例句引用现有文稿。所有速查内容集中在独立小节，原有句旁笔记未追加内容。\n\n${chapters.map(chapter => `## ${chapter.id} ${chapter.title}\n\n${renderReference(getLesson(chapter))}`).join('\n\n---\n\n')}\n`);
console.log('Manuscript validation passed:', JSON.stringify(totals));
console.log(`Exported ${chapters.length} chapter files, an index, the full manuscript, and structured JSON.`);
