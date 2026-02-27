const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

function htmlEscape(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function negotiateAndHash(password, supported) {
  // Negotiation logic
  let selected = '';
  let hash = '';
  let message = '';

  if (supported.includes('md5')) {
    selected = 'md5';
    hash = crypto.createHash('md5').update(password, 'utf8').digest('hex');
    message = 'Negotiated algorithm: md5';
  } else if (supported.includes('sha-1') || supported.includes('sha1')) {
    selected = 'sha-1';
    hash = crypto.createHash('sha1').update(password, 'utf8').digest('hex');
    message = 'Negotiated algorithm: sha-1';
  } else if (supported.includes('sha256')) {
    selected = 'sha256';
    hash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
    message = 'Negotiated algorithm: sha256';
  } else {
    message = 'No mutually supported algorithm.';
  }

  return { selected, hash, message };
}

function renderPage({ password = '', message = '', selected = '', hash = '' } = {}) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Test 91 v2</title>
</head>
<body>
  <h1>Test 91 v2</h1>

  <form method="post" action="/hash">
    <label for="password">Password to hash:</label><br>
    <input type="text" id="password" name="password" value="${htmlEscape(password)}" required>

    <!-- Hidden static supported algorithm list (client always "supports" all 3) -->
    <input type="hidden" name="supported_algs[]" value="md5">
    <input type="hidden" name="supported_algs[]" value="sha-1">
    <input type="hidden" name="supported_algs[]" value="sha256">

    <br><br>
    <button type="submit">Submit</button>
  </form>

  ${message ? `
  <div style="margin-top:15px; padding:10px; border:1px solid #ccc;">
    <strong>${htmlEscape(message)}</strong><br>
    ${selected ? `
      <div>Selected: <code>${htmlEscape(selected)}</code></div>
      <div>Hash: <code>${htmlEscape(hash)}</code></div>
    ` : ''}
  </div>
  ` : ''}
</body>
</html>`;
}

app.get('/', (req, res) => {
  res.send(renderPage());
});

app.post('/hash', (req, res) => {
  const password = req.body.password || '';
  const raw = req.body['supported_algs[]'] ?? req.body.supported_algs ?? [];
  const supported = Array.isArray(raw) ? raw.map(String) : [String(raw)];

  const { selected, hash, message } = negotiateAndHash(password, supported);
  res.send(renderPage({ password, message, selected, hash }));
});

app.listen(port, () => {
  console.log(`Test 91 v2 server running on port ${port}`);
});