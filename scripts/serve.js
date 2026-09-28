// Tiny static file server for the built Jekyll site (no dependencies).
// Usage: node scripts/serve.js  (serves _site/ on PORT, default 8080)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '8080', 10);
const ROOT = path.join(__dirname, '..', '_site');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (urlPath.endsWith('/')) urlPath += 'index.html';

  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        // Fallback to the 404 page like GitHub Pages does
        fs.readFile(path.join(ROOT, '404.html'), (err3, data404) => {
          if (err3) {
            res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(data404);
          }
        });
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Serving _site at http://0.0.0.0:${PORT}`);
});
