// Increment the reader version only when a content schema requires a new APK.
export const readerVersion = 1;
export const bundledRevision = 2026101001;
export const contentVersion = '0.6';
export const contentBaseUrl = 'https://raw.githubusercontent.com/likemomo-lulu/english-learning/main/content/';
export const contentSources = [contentBaseUrl, 'https://cdn.jsdelivr.net/gh/likemomo-lulu/english-learning@main/content/'];
export const maxContentBytes = 4 * 1024 * 1024;

const nonempty = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 20000;
const requireValue = (condition, message) => { if (!condition) throw new Error(`内容校验失败：${message}`); };
const hasText = (value, fields, name) => {
  requireValue(value && typeof value === 'object', name);
  for (const field of fields) requireValue(nonempty(value[field]), `${name}.${field}`);
};

// Validate every field consumed by the reader before saving or displaying downloaded JSON.
export function validateContent(pack, previous) {
  requireValue(pack?.format === 'scene-english-content' && pack.schemaVersion === readerVersion, '格式不兼容');
  requireValue(Number.isSafeInteger(pack.revision) && pack.revision > 0 && nonempty(pack.version), '版本无效');
  requireValue(Array.isArray(pack.chapters) && pack.chapters.length > 0 && pack.chapters.length <= 500, '章节数量无效');
  const chapterIds = new Set();
  const sentenceIds = new Set();
  for (const ch of pack.chapters) {
    hasText(ch, ['id', 'title', 'english', 'icon', 'group', 'task', 'example', 'translation', 'scenario'], '章节');
    requireValue(/^[DTW]\d{2,3}$/.test(ch.id) && !chapterIds.has(ch.id), '章节编号重复或无效');
    chapterIds.add(ch.id);
    requireValue(ch.ready === true && ch.sample === false, `${ch.id} 材料状态`);
    requireValue(Array.isArray(ch.phrases) && ch.phrases.length >= 6 && ch.phrases.length <= 100 && ch.phrases.every(nonempty), `${ch.id} 词组`);
    requireValue(Array.isArray(ch.lines) && ch.lines.length === 12, `${ch.id} 核心句`);
    const sentences = [...ch.lines];
    for (const key of ['dialogues', 'branches']) {
      requireValue(Array.isArray(ch[key]) && ch[key].length >= 2 && ch[key].length <= 30, `${ch.id} ${key}`);
      for (const part of ch[key]) {
        hasText(part, ['title', 'subtitle'], `${ch.id} ${key}`);
        requireValue(Array.isArray(part.lines) && part.lines.length >= (key === 'dialogues' ? 6 : 4) && part.lines.length <= (key === 'dialogues' ? 10 : 6), `${ch.id} 对话行数`);
        sentences.push(...part.lines);
      }
    }
    for (const line of sentences) {
      hasText(line, ['id', 'chapterId', 'en', 'zh', 'role', 'tone'], `${ch.id} 句子`);
      requireValue(line.chapterId === ch.id && new RegExp(`^${ch.id}-(S|[A-Z]+-S)\\d{2}$`).test(line.id) && !sentenceIds.has(line.id), `${ch.id} 句子编号`);
      requireValue(line.note === undefined || nonempty(line.note), `${line.id} 表达笔记`);
      sentenceIds.add(line.id);
    }
    requireValue(ch.lines.filter(line => line.note).length >= 3, `${ch.id} 表达笔记数量`);
    requireValue(Array.isArray(ch.quickReference) && ch.quickReference.length === 6, `${ch.id} 速查条目`);
    for (const entry of ch.quickReference) {
      hasText(entry, ['id', 'chapterId', 'en', 'zh', 'note', 'keyword', 'exampleId', 'exampleEn', 'exampleZh'], `${ch.id} 速查`);
      requireValue(entry.chapterId === ch.id && new RegExp(`^${ch.id}-Q\\d{2}$`).test(entry.id) && !sentenceIds.has(entry.id), `${ch.id} 速查编号`);
      hasText(entry.phonetics, ['uk', 'us', 'source'], `${entry.id} 音标`);
      requireValue(entry.phonetics.source.startsWith('https://dictionary.cambridge.org/dictionary/english/'), `${entry.id} 音标来源`);
      const example = sentences.find(line => line.id === entry.exampleId);
      requireValue(example && example.en === entry.exampleEn && example.zh === entry.exampleZh, `${entry.id} 例句引用`);
      sentenceIds.add(entry.id);
    }
    const practice = ch.practice;
    requireValue(practice && Array.isArray(practice.substitutions) && practice.substitutions.length === 3 && practice.substitutions.every(nonempty), `${ch.id} 替换练习`);
    requireValue(Array.isArray(practice.responses) && practice.responses.length === 3 && practice.responses.every(row => Array.isArray(row) && row.length === 3 && row.every(nonempty)), `${ch.id} 回应练习`);
    requireValue(nonempty(practice.task), `${ch.id} 自由任务`);
  }
  // Updates may edit text but cannot remove old chapter/sentence IDs or move saved sentences.
  if (previous) {
    const next = new Map(pack.chapters.map(ch => [ch.id, ch]));
    for (const ch of previous.chapters) {
      requireValue(next.has(ch.id), `缺少原章节 ${ch.id}`);
      const collect = item => [...item.lines, ...item.dialogues.flatMap(p => p.lines), ...item.branches.flatMap(p => p.lines)].map(line => line.id);
      const ids = new Set(collect(next.get(ch.id)));
      requireValue(collect(ch).every(id => ids.has(id)), `${ch.id} 缺少原句编号`);
    }
  }
  return pack;
}

// A manifest points only to immutable files in the configured content directory.
export function validateManifest(value) {
  requireValue(value?.format === 'scene-english-manifest' && value.schemaVersion === readerVersion, '更新清单格式');
  requireValue(Number.isSafeInteger(value.revision) && value.revision > 0 && nonempty(value.version), '更新版本');
  requireValue(Number.isSafeInteger(value.minReaderVersion) && value.minReaderVersion > 0, '阅读器版本');
  if (value.minReaderVersion > readerVersion) throw new Error('此内容需要新版 App，请先更新安装包。');
  requireValue(value.file === `pack-${value.revision}.json` && /^[a-f0-9]{64}$/.test(value.sha256), '下载地址或校验值');
  requireValue(Number.isSafeInteger(value.bytes) && value.bytes > 0 && value.bytes <= maxContentBytes, '内容包大小');
  return value;
}
