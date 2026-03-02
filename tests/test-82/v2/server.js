const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

// Constant 32-byte AES-256 key
const key = Buffer.from(
  '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
  'hex'
);
const nonce = Buffer.from('AAAAAAAAAAAA', 'utf8'); // 12 bytes

// In-memory encryption history
const history = [];

function encryptReuseNonce(plaintext) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return {
    ciphertextB64: ciphertext.toString('base64'),
    tagB64: tag.toString('base64')
  };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderPage(message = '') {
  const rows = history
    .slice(-10)
    .reverse()
    .map(entry => `
      <tr>
        <td>${escapeHtml(entry.timestamp)}</td>
        <td><code>${escapeHtml(entry.plaintext)}</code></td>
        <td><code>${escapeHtml(entry.ciphertext)}</code></td>
        <td><code>${escapeHtml(entry.tag)}</code></td>
      </tr>
    `)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Test 82</title>
</head>
<body>
  <h1>Test 82</h1>
  <p><strong>Key (base64):</strong> ${key.toString('base64')}</p>
  <p><strong>Nonce (base64):</strong> ${nonce.toString('base64')}</p>

  <hr>

  <h2>Encrypt a Message</h2>
  <form method="post" action="/encrypt">
    <input type="text" name="plaintext" style="width:400px" placeholder="Enter plaintext" required>
    <button type="submit">Encrypt</button>
  </form>

  ${message ? `<div style="margin-top:10px;border:1px solid #ccc;padding:10px;">${message}</div>` : ''}

  <hr>

  <h2>Recent Encryptions</h2>
  ${
    history.length === 0
      ? '<p>No encryptions yet.</p>'
      : `
      <table border="1" cellpadding="6">
        <tr>
          <th>Timestamp</th>
          <th>Plaintext</th>
          <th>Ciphertext (base64)</th>
          <th>Tag (base64)</th>
        </tr>
        ${rows}
      </table>
      `
  }
</body>
</html>
`;
}

app.get('/', (req, res) => {
  res.send(renderPage());
});

app.post('/encrypt', (req, res) => {
  const plaintext = req.body.plaintext || '';
  const { ciphertextB64, tagB64 } = encryptReuseNonce(plaintext);

  history.push({
    timestamp: new Date().toISOString(),
    plaintext,
    ciphertext: ciphertextB64,
    tag: tagB64
  });

  const message = `
    <p><strong>Plaintext:</strong> ${escapeHtml(plaintext)}</p>
    <p><strong>Ciphertext:</strong> ${ciphertextB64}</p>
    <p><strong>Tag:</strong> ${tagB64}</p>
  `;

  res.send(renderPage(message));
});

app.listen(port, () => {
  console.log(`Test 82 v3 server running on port ${port}`);
});