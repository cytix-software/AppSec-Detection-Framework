const net = require('net');
const { URL } = require('url');

function parseHeaders(headerLines) {
    const headers = {};
    for (const line of headerLines) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const name = line.slice(0, idx).trim().toLowerCase();
        const value = line.slice(idx + 1).trim();
        headers[name] = value;
    }
    return headers;
}

function buildResponse(statusCode, body) {
    const reason = statusCode === 200 ? 'OK' :
                   statusCode === 403 ? 'Forbidden' :
                   statusCode === 404 ? 'Not Found' : 'Error';

    return (
        `HTTP/1.1 ${statusCode} ${reason}\r\n` +
        `Content-Length: ${Buffer.byteLength(body)}\r\n` +
        `Content-Type: text/plain\r\n` +
        `Connection: keep-alive\r\n` +
        `\r\n` +
        body
    );
}

// Naive parser:
// - trusts Content-Length
// - ignores Transfer-Encoding entirely
// - treats leftover bytes as the next request on the same connection
function tryParseOneRequest(buffer) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) {
        return null;
    }

    const headerBlock = buffer.slice(0, headerEnd);
    const lines = headerBlock.split('\r\n');
    const requestLine = lines.shift();

    if (!requestLine) {
        return null;
    }

    const parts = requestLine.split(' ');
    if (parts.length < 3) {
        return null;
    }

    const [method, path, version] = parts;
    const headers = parseHeaders(lines);

    const contentLength = parseInt(headers['content-length'] || '0', 10);
    const bodyStart = headerEnd + 4;
    const totalNeeded = bodyStart + (Number.isNaN(contentLength) ? 0 : contentLength);

    if (buffer.length < totalNeeded) {
        return null;
    }

    const body = buffer.slice(bodyStart, totalNeeded);
    const remaining = buffer.slice(totalNeeded);

    return {
        request: {
            method,
            path,
            version,
            headers,
            body
        },
        remaining
    };
}

function handleRequest(req) {
    let body = 'Backend default page';
    let status = 200;

    try {
        const url = new URL(req.path, 'http://backend.local');

        if (url.pathname === '/products.php') {
            if (url.searchParams.has('secret')) {
                body = 'SECRET PAGE';
            } else if (url.searchParams.has('id')) {
                body = `Product ID: ${url.searchParams.get('id')}`;
            }
        } else if (url.pathname === '/') {
            body = 'Backend default page';
        } else {
            status = 404;
            body = 'Not Found';
        }
    } catch {
        status = 404;
        body = 'Not Found';
    }

    return buildResponse(status, body);
}

const server = net.createServer((socket) => {
    let buffer = '';

    socket.on('data', (chunk) => {
        buffer += chunk.toString('latin1');

        while (true) {
            const parsed = tryParseOneRequest(buffer);
            if (!parsed) break;

            const { request, remaining } = parsed;

            console.log('Parsed request:', {
                method: request.method,
                path: request.path,
                headers: request.headers
            });

            const response = handleRequest(request);
            socket.write(response);

            buffer = remaining;
        }
    });

    socket.on('error', (err) => {
        if (err.code !== 'ECONNRESET') {
            console.error('Socket error:', err);
        }
    });
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(8080, () => {
    console.log('Naive HTTP backend listening on 8080');
});