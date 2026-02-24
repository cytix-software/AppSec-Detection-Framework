const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Hardcoded server secret used to issue/verify auth cookie
const SERVER_SECRET = 'super-secret-key';

// Valid request window (seconds)
const VALID_WINDOW_SECONDS = 60;

function issueAuthCookie(res) {
  const token = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update('user-session')
    .digest('hex');

  // httpOnly true so browser JS can’t read it
  res.cookie('auth_token', token, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    path: '/',
    httpOnly: true,
    sameSite: 'Lax'
  });
}

function verifyAuthCookie(req) {
  const cookie = req.cookies && req.cookies.auth_token;
  if (!cookie) return false;

  const expected = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update('user-session')
    .digest('hex');

  // timingSafeEqual requires equal length buffers
  const a = Buffer.from(cookie, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

app.get('/', (req, res) => {
  // Simulated “login”: issue cookie if missing
  if (!req.cookies || !req.cookies.auth_token) {
    issueAuthCookie(res);
    return res.send('<p>Auth cookie issued. Refresh page.</p>');
  }

  res.send(`<!doctype html>
<html>
<head><title>Secure Echo</title></head>
<body>
  <h1>Secure Echo (Cookie + Timestamp)</h1>

  <form method="POST" action="/echo">
    <label>Message:</label><br>
    <input type="text" name="message" required><br><br>

    <input type="hidden" name="ts" value="${Math.floor(Date.now() / 1000)}">

    <button type="submit">Send</button>
  </form>

  <p>Requests expire after ${VALID_WINDOW_SECONDS} seconds.</p>
</body>
</html>`);
});

app.post('/echo', (req, res) => {
  // Check cookie authenticity
  if (!verifyAuthCookie(req)) {
    return res.status(401).send('Invalid authentication token.');
  }

  const message = req.body.message || '';
  const tsRaw = req.body.ts || '';

  // Validate timestamp
  const ts = Number(tsRaw);
  if (!Number.isFinite(ts)) {
    return res.status(400).send('Invalid timestamp.');
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > VALID_WINDOW_SECONDS) {
    return res.status(401).send('Request expired.');
  }

  res.send(`<!doctype html>
<html>
<head><title>Secure Echo</title></head>
<body>
  <h3>Message accepted:</h3>
  <p>${escapeHtml(message)}</p>
  <p><a href="/">Back</a></p>
</body>
</html>`);
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.listen(port, () => {
  console.log(`Secure Echo server running on port ${port}`);
});