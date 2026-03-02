const express = require("express");

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow:");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test 18</title>
</head>
<body>
  <h1>Test 18</h1>

  <form action="/header" method="get">
    <label for="val">Enter a Value</label><br />
    <input type="text" id="val" name="val" value="test" style="width: 320px;">
    <button type="submit">Go</button>
  </form>
</body>
</html>`);
});

// Writes a raw HTTP response so CRLF in val can affect headers.
app.get("/header", (req, res) => {
  const val = String(req.query.val ?? "");

  const body = `<!doctype html>
<html>
  <body>
    <h1>/header</h1>
    <p>Value: ${val}</p>
    <p><a href="/">Back</a></p>
  </body>
</html>`;

  const buf = Buffer.from(body, "utf8");

  const raw =
    "HTTP/1.1 200 OK\r\n" +
    "Content-Type: text/html; charset=utf-8\r\n" +
    "Connection: close\r\n" +
    `X-Custom-Header: ${val}\r\n` +
    `Content-Length: ${buf.length}\r\n` +
    "\r\n";

  // Stop Express from trying to manage the response after we take over.
  res.socket.write(raw);
  res.socket.write(buf);
  res.socket.end();
});

app.listen(port, () => {
  console.log("Express server listening on " + port);
});