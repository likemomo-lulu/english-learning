import { chapters, getLesson } from './data.js';
import { bundledRevision, contentVersion, readerVersion } from './content-format.js';

// Keep a complete offline fallback in every APK, using the same schema as remote packs.
export const bundledContent = {
  format: 'scene-english-content', schemaVersion: readerVersion,
  revision: bundledRevision, version: contentVersion,
  chapters: chapters.map(chapter => ({ ...chapter, ...getLesson(chapter) })),
};
