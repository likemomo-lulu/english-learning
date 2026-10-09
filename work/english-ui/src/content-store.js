import { contentBaseUrl, contentSources, maxContentBytes, validateContent, validateManifest } from './content-format.js';

const cacheKey = 'scene-english-content-v1';

// One localStorage entry commits atomically; a failed write leaves the previous content intact.
export function loadContent(bundled, storage = localStorage) {
  try {
    const raw = storage.getItem(cacheKey);
    if (!raw) return { content: bundled, error: '' };
    if (new TextEncoder().encode(raw).length > maxContentBytes) throw new Error('缓存超过大小限制');
    const cached = validateContent(JSON.parse(raw), bundled);
    return { content: cached.revision > bundled.revision ? cached : bundled, error: '' };
  } catch (error) {
    console.error('Cannot load cached lesson content:', error);
    return { content: bundled, error: '下载内容未能读取，已使用内置教材。' };
  }
}

// Limit response size even when the server omits Content-Length; cancel oversized downloads.
async function readLimited(response, limit) {
  if (!response.ok) {
    const error = new Error(`更新服务暂不可用（HTTP ${response.status}），请稍后重试。`);
    error.retryable = response.status === 404 || response.status === 429 || response.status >= 500;
    throw error;
  }
  if (Number(response.headers.get('content-length')) > limit) throw new Error('内容包超过大小限制。');
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) throw new Error('内容包超过大小限制。');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

// HTTPS origin, SHA-256, schema and legacy IDs must all pass before activating an update.
async function downloadFromSource(current, { fetcher = fetch, storage = localStorage, cryptoApi = crypto, signal, baseUrl = contentBaseUrl, onPhase = () => {} } = {}) {
  onPhase('checking');
  const manifestBytes = await readLimited(await fetcher(`${baseUrl}manifest.json?check=${Date.now()}`, { cache: 'no-store', signal }), 16384);
  const manifest = validateManifest(JSON.parse(new TextDecoder().decode(manifestBytes)));
  if (manifest.revision <= current.revision) return { content: current, updated: false };
  onPhase('downloading');
  const bytes = await readLimited(await fetcher(`${baseUrl}${manifest.file}`, { cache: 'no-store', signal }), maxContentBytes);
  const hash = [...new Uint8Array(await cryptoApi.subtle.digest('SHA-256', bytes))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  if (bytes.length !== manifest.bytes || hash !== manifest.sha256) throw new Error('内容包完整性校验失败，已保留原教材。');
  const raw = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const content = validateContent(JSON.parse(raw), current);
  if (content.revision !== manifest.revision || content.version !== manifest.version) throw new Error('内容包与更新清单版本不一致。');
  signal?.throwIfAborted();
  onPhase('saving');
  try { storage.setItem(cacheKey, raw); }
  catch (error) { console.error('Cannot persist downloaded content:', error); throw new Error('内容保存失败，请检查可用空间；已保留原教材。'); }
  return { content, updated: true };
}

// Fail over only for connection/service errors, keeping schema, integrity and storage failures visible.
export async function downloadContent(current, options = {}) {
  const sources = options.baseUrl ? [options.baseUrl] : options.sources || contentSources;
  for (const [index, baseUrl] of sources.entries()) {
    options.signal?.throwIfAborted();
    const controller = new AbortController();
    const abort = () => controller.abort();
    options.signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 8000);
    try {
      return await downloadFromSource(current, {
        ...options, baseUrl, signal: controller.signal,
        onPhase: phase => {
          // Once the manifest is reachable, allow the App's full timeout to finish the larger pack.
          if (phase === 'downloading') clearTimeout(timeout);
          options.onPhase?.(phase);
        },
      });
    } catch (error) {
      if (options.signal?.aborted || index === sources.length - 1 || !(error.name === 'AbortError' || error instanceof TypeError || error.retryable)) throw error;
      console.warn('Content source unavailable; trying the alternate GitHub content source:', error);
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener('abort', abort);
    }
  }
}
