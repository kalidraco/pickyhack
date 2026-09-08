#!/usr/bin/env python3
"""
PickyHack Development HTTP Server
Location: src/backend/server.py
Features:
- Socket reuse to prevent [Errno 48] Address already in use
- Graceful port fallback
- Standard security headers (nosniff, sameorigin)
- Serves static workspace root files
"""

import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8088

class SecureHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Security headers
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def translate_path(self, path):
        # Always serve from workspace root
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        # Sanitize path to prevent traversal
        clean_path = path.split("?", 1)[0].split("#", 1)[0]
        trailing_slash = clean_path.rstrip().endswith('/')
        try:
            clean_path = clean_path.lstrip('/')
            full_path = os.path.abspath(os.path.join(root_dir, clean_path))
            if not full_path.startswith(root_dir):
                return root_dir
            if trailing_slash and not full_path.endswith('/'):
                full_path += '/'
            return full_path
        except Exception:
            return root_dir

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def run_server():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT

    for p in range(port, port + 20):
        try:
            with ReusableTCPServer(("", p), SecureHTTPRequestHandler) as httpd:
                print(f"\n==================================================", flush=True)
                print(f"  PickyHack 98 Workstation running live at:", flush=True)
                print(f"  --> http://localhost:{p}", flush=True)
                print(f"==================================================\n", flush=True)
                print("Press Ctrl+C to stop the server.", flush=True)
                httpd.serve_forever()
                return
        except OSError as e:
            if e.errno == 48:  # Address already in use
                print(f"[!] Port {p} is currently in use, trying port {p + 1}...", flush=True)
                continue
            else:
                raise e

if __name__ == '__main__':
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nPickyHack server stopped.")
        sys.exit(0)
