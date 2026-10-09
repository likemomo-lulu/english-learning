import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// Serve only the generated prototype on loopback, never a directory or arbitrary path.
const document = new URL('../../outputs/english-app-ui/index.html', import.meta.url);
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method) || request.url?.split('?')[0] !== '/') {
    response.writeHead(404).end('Not found'); return;
  }
  try {
    const html = await readFile(document);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : html);
  } catch (error) {
    console.error('Cannot serve prototype:', error);
    response.writeHead(500).end('Prototype unavailable');
  }
});
server.on('error', error => { console.error('Preview server failed:', error); process.exitCode = 1; });
server.listen(4178, '127.0.0.1', () => console.log('English UI preview: http://127.0.0.1:4178'));
