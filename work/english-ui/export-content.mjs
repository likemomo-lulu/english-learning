import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { bundledContent } from './src/bundled-content.js';
import { readerVersion, maxContentBytes, validateContent } from './src/content-format.js';

// Publish versioned JSON first, then its manifest; never rewrite an existing revision.
const output = new URL('../../content/', import.meta.url);
validateContent(bundledContent);
const raw = `${JSON.stringify(bundledContent)}\n`;
const bytes = Buffer.byteLength(raw);
if (bytes > maxContentBytes) throw new Error('Content package exceeds reader limit');
await mkdir(output, { recursive: true });
const file = `pack-${bundledContent.revision}.json`;
const target = new URL(file, output);
try {
  const existing = await readFile(target, 'utf8');
  if (existing !== raw) throw new Error('Content revision already exists; increment bundledRevision before exporting changed material');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(target, raw);
const manifest = {
  format: 'scene-english-manifest', schemaVersion: readerVersion,
  minReaderVersion: readerVersion, revision: bundledContent.revision, version: bundledContent.version,
  file, bytes, sha256: createHash('sha256').update(raw).digest('hex'),
};
await writeFile(new URL('manifest.json', output), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Content package exported:', JSON.stringify(manifest));
