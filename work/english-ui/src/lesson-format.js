// Core rows: English, Chinese, speaker, usage note. Conversation rows: speaker, English, Chinese.
// Stable IDs keep favorites and progress attached to the same sentence across builds.
export function defineLesson(id, content) {
  const convert = (prefix, rows, core = false) => rows.map((row, index) => {
    const [en, zh, role, note] = core ? row : [row[1], row[2], row[0], row[3]];
    return { id: `${prefix}-S${String(index + 1).padStart(2, '0')}`, chapterId: id, en, zh, role, note, tone: core ? '常用表达' : '日常对话' };
  });
  const sections = (items, offset) => items.map(([title, subtitle, rows], index) => ({ title, subtitle, lines: convert(`${id}-${String.fromCharCode(65 + offset + index)}`, rows) }));
  return {
    scenario: content.scenario, phrases: content.phrases,
    lines: convert(id, content.core, true),
    dialogues: sections(content.dialogues, 0), branches: sections(content.branches, 2),
    practice: content.practice,
  };
}
