const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/index.html") {
    const filePath = path.join(PUBLIC_DIR, "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Internal Server Error");
      }
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (url === "/svg1.svg") {
    console.log("强缓存~");
    const filePath = path.join(PUBLIC_DIR, "svg1.svg");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not Found");
      }
      res.writeHead(200, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600", // 强缓存，缓存1小时
      });
      res.end(data);
    });
  } else if (url === "/svg2.svg") {
    console.log("协商缓存~");
    const filePath = path.join(PUBLIC_DIR, "svg2.svg");

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not Found");
      }

      const lastModified = stats.mtime.toUTCString();
      const ifModifiedSince = req.headers["if-modified-since"];

      if (ifModifiedSince === lastModified) {
        res.writeHead(304); // 协商缓存命中
        return res.end();
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end("Internal Server Error");
        }

        res.writeHead(200, {
          "Content-Type": "image/svg+xml",
          "Last-Modified": lastModified,
          "Cache-Control": "no-cache", // 告诉浏览器每次都要协商
        });
        res.end(data);
      });
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
