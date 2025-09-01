const http = require('http');
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    console.log('--- Incoming Request ---');
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', body);
    if (req.url === '/malicious') {
      res.end('Smuggled request received!');
    } else {
      res.end('Received: ' + body);
    }
  });
});
server.listen(5000, '0.0.0.0');