const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 5500;
const API_TARGET = "sc-gis.nict.go.jp";

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
  ".gif": "image/gif",
};

const server = http.createServer((req, res) => {
  // /api/* リクエストをNICTサーバーにプロキシ
  if (req.url.startsWith("/api/")) {
    const options = {
      hostname: API_TARGET,
      port: 443,
      path: req.url,
      method: req.method,
      headers: {
        "Host": API_TARGET,
        "User-Agent": req.headers["user-agent"] || "localhimawari-proxy",
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        "Content-Type": proxyRes.headers["content-type"] || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      });
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy error:", err.message);
      res.writeHead(502);
      res.end("Proxy error: " + err.message);
    });

    proxyReq.end();
    return;
  }

  // 静的ファイル配信
  let filePath = path.join(__dirname, req.url.split("?")[0]);
  if (filePath.endsWith("/")) filePath += "index.html";

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`localhimawari proxy server running at http://localhost:${PORT}/`);
  console.log(`/api/* -> https://${API_TARGET}/api/*`);
});
