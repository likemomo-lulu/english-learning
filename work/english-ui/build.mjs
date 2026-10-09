import { build } from 'esbuild';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// The deliverable embeds its JS and CSS so it can be opened without a server.
const output = fileURLToPath(new URL('../../outputs/english-app-ui/', import.meta.url));
const result = await build({
  entryPoints: [fileURLToPath(new URL('./src/app.jsx', import.meta.url))],
  bundle: true,
  write: false,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
});
const styles = await readFile(new URL('./src/style.css', import.meta.url), 'utf8');
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<title>日常英语 · 场景学习</title>
<style>${styles}</style></head><body><div id="root"></div>
<script>${result.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script>
</body></html>`;
await mkdir(output, { recursive: true });
await writeFile(`${output}/index.html`, html);
// Capacitor receives only runtime assets, excluding manuscript exports and screenshots.
const nativeOutput = new URL('./dist/', import.meta.url);
await mkdir(nativeOutput, { recursive: true });
await writeFile(new URL('index.html', nativeOutput), html);
console.log(`Built: ${output}/index.html`);
