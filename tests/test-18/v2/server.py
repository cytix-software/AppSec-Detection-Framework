import socket
import threading
import urllib.parse

HOST = "0.0.0.0"
PORT = 80

MAX_HEADER_BYTES = 64 * 1024  # basic safety cap


def parse_http_request(header_bytes: bytes):
    # Decode headers safely
    text = header_bytes.decode("iso-8859-1", errors="replace")
    lines = text.split("\r\n")
    request_line = lines[0] if lines else ""
    parts = request_line.split(" ")

    if len(parts) < 2:
        return None

    method = parts[0].upper()
    target = parts[1]

    # Strip fragment
    target = target.split("#", 1)[0]

    if "?" in target:
        path, qs = target.split("?", 1)
        query = urllib.parse.parse_qs(qs, keep_blank_values=True)
        # Flatten to first value
        query = {k: (v[0] if v else "") for k, v in query.items()}
    else:
        path = target
        query = {}

    return method, path, query


def send_response(conn: socket.socket, status: str, headers: list[str], body: bytes):
    head = (
        f"HTTP/1.1 {status}\r\n"
        + "\r\n".join(headers)
        + "\r\n"
        + f"Content-Length: {len(body)}\r\n"
        + "Connection: close\r\n"
        + "\r\n"
    ).encode("iso-8859-1", errors="replace")
    conn.sendall(head + body)


def page_index():
    return (
        "<!DOCTYPE html>\n"
        "<html lang=\"en\">\n"
        "<head>\n"
        "  <meta charset=\"UTF-8\">\n"
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "  <title>Test 18</title>\n"
        "</head>\n"
        "<body>\n"
        "  <h1>Test 18</h1>\n"
        "  <h2>Custom header test</h2>\n"
        "  <form action=\"/header\" method=\"get\">\n"
        "    <label for=\"val\">Enter a Value for HTTP Header</label><br />\n"
        "    <input type=\"text\" id=\"val\" name=\"val\" value=\"test\" style=\"width: 300px;\">\n"
        "    <button type=\"submit\">Go</button>\n"
        "  </form>\n"
        "</body>\n"
        "</html>\n"
    ).encode("utf-8")


def page_header(val: str):
    return (
        "<!doctype html>\n"
        "<html>\n"
        "  <body>\n"
        "    <h1>/header</h1>\n"
        f"    <p>Value: {val}</p>\n"
        "    <p><a href=\"/\">Back</a></p>\n"
        "  </body>\n"
        "</html>\n"
    ).encode("utf-8")


def handle_one_connection(conn: socket.socket):
    conn.settimeout(5.0)
    buf = b""

    # Read until end of headers
    while b"\r\n\r\n" not in buf:
        chunk = conn.recv(4096)
        if not chunk:
            return
        buf += chunk
        if len(buf) > MAX_HEADER_BYTES:
            return

    header_part = buf.split(b"\r\n\r\n", 1)[0] + b"\r\n\r\n"
    parsed = parse_http_request(header_part)
    if not parsed:
        return

    method, path, query = parsed

    # Basic method handling
    if method not in ("GET", "HEAD"):
        body = b"method not allowed"
        send_response(
            conn,
            "405 Method Not Allowed",
            ["Content-Type: text/plain; charset=utf-8"],
            b"" if method == "HEAD" else body,
        )
        return

    if path == "/robots.txt":
        body = b"User-agent: *\nDisallow:\n"
        send_response(
            conn,
            "200 OK",
            ["Content-Type: text/plain; charset=utf-8"],
            b"" if method == "HEAD" else body,
        )
        return

    if path == "/favicon.ico":
        send_response(conn, "204 No Content", [], b"")
        return

    if path == "/":
        body = page_index()
        send_response(
            conn,
            "200 OK",
            ["Content-Type: text/html; charset=utf-8"],
            b"" if method == "HEAD" else body,
        )
        return

    if path == "/header":
        val = query.get("val", "")
        body = page_header(val)

        # Intentionally unsafe: user-controlled value goes into a header line
        hdrs = [
            "Content-Type: text/html; charset=utf-8",
            f"X-Custom-Header: {val}",
        ]
        send_response(conn, "200 OK", hdrs, b"" if method == "HEAD" else body)
        return

    body = b"not found"
    send_response(
        conn,
        "404 Not Found",
        ["Content-Type: text/plain; charset=utf-8"],
        b"" if method == "HEAD" else body,
    )

def handle_client(conn):
    with conn:
        try:
            handle_one_connection(conn)
        except Exception:
            pass

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((HOST, PORT))
        s.listen(200)

        print(f"Listening on {HOST}:{PORT}")

        while True:
            conn, _ = s.accept()
            threading.Thread(
                target=handle_client,
                args=(conn,),
                daemon=True
            ).start()


if __name__ == "__main__":
    main()