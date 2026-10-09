import { quickReferenceContent } from './quick-reference-content.js';
import { keywordIPA } from './reference-ipa.js';

// Resolve examples from existing lessons; quick-reference IDs never replace sentence IDs.
export function buildQuickReference(chapterId, lesson) {
  const sentences = [...lesson.lines, ...lesson.dialogues.flatMap(part => part.lines), ...lesson.branches.flatMap(part => part.lines)];
  return quickReferenceContent[chapterId].map(([en, zh, keyword, note, fragment], index) => {
    const example = sentences.find(sentence => sentence.en.toLowerCase().includes(fragment.toLowerCase()));
    const phonetics = keywordIPA[keyword];
    if (!example || !phonetics?.uk || !phonetics?.us) throw new Error(`Incomplete quick reference: ${chapterId} / ${en}`);
    return {
      id: `${chapterId}-Q${String(index + 1).padStart(2, '0')}`, chapterId, en, zh, note,
      keyword: keyword === 'used-to' ? 'used to' : keyword, phonetics,
      exampleId: example.id, exampleEn: example.en, exampleZh: example.zh,
    };
  });
}
