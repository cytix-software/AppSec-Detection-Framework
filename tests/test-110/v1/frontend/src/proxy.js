const net = require('net');

const BACKEND_HOST = process.env.BACKEND_HOST || 'test_110_v1_backend';
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 8080);

function parseFirstRequest(buffer) {
    const end = buffer.indexOf('\r\n\r\n');
    if (end === -1) return null;

    const headerBlock = buffer.slice(0, end);
    const lines = headerBlock.split('\r\n');
    const requestLine = lines.shift();

    if (!requestLine) return null;

    const parts = requestLine.split(' ');
    if (parts.length < 2) return null;

    const method = parts[0];
    const path = parts[1];

    return { method, path, headerEnd: end + 4 };
}

const server = net.createServer((client) => {
    let buffer = '';
    let decided = false;
    let backend = null;

    client.on('data', (chunk) => {
        if (decided) {
            if (backend) backend.write(chunk);
            return;
        }

        buffer += chunk.toString('latin1');

        const req = parseFirstRequest(buffer);
        if (!req) {
            return; // wait for full headers
        }

        decided = true;
        console.log('Frontend saw request:', {
            method: req.method,
            path: req.path
        });

        if (req.path.startsWith('/products.php') && req.path.includes('?secret')) {
            const body = 'Forbidden';
            client.write(
                'HTTP/1.1 403 Forbidden\r\n' +
                `Content-Length: ${Buffer.byteLength(body)}\r\n` +
                'Content-Type: text/plain\r\n' +
                'Connection: close\r\n' +
                '\r\n' +
                body
            );
            client.end();
            return;
        }

        backend = net.connect(BACKEND_PORT, BACKEND_HOST, () => {
            backend.write(Buffer.from(buffer, 'latin1'));
            client.pipe(backend);
            backend.pipe(client);
        });

        backend.on('error', (err) => {
            console.error('Backend connection error:', err);
            if (!client.destroyed) {
                client.write(
                    'HTTP/1.1 502 Bad Gateway\r\n' +
                    'Content-Length: 11\r\n' +
                    'Connection: close\r\n' +
                    '\r\n' +
                    'Bad Gateway'
                );
                client.end();
            }
        });
    });

    client.on('error', (err) => {
        if (err.code !== 'ECONNRESET') {
            console.error('Client socket error:', err);
        }
    });
});

server.listen(80, () => {
    console.log(`Naive proxy listening on port 80 -> ${BACKEND_HOST}:${BACKEND_PORT}`);
});