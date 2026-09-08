#!/usr/bin/env python3
"""
PickyHack Development HTTP Server
Includes socket reuse and graceful port fallback to prevent [Errno 48] Address already in use.
"""

import http.server
import socketserver
import sys

DEFAULT_PORT = 8088

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

Handler = http.server.SimpleHTTPRequestHandler

def run_server():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT

    for p in range(port, port + 20):
        try:
            with ReusableTCPServer(("", p), Handler) as httpd:
                print(f"\n==================================================")
                print(f"  PickyHack 98 Workstation running live at:")
                print(f"  --> http://localhost:{p}")
                print(f"==================================================\n")
                print("Press Ctrl+C to stop the server.")
                httpd.serve_forever()
                return
        except OSError as e:
            if e.errno == 48:  # Address already in use
                print(f"[!] Port {p} is currently in use, trying port {p + 1}...")
                continue
            else:
                raise e

if __name__ == '__main__':
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nPickyHack server stopped.")
        sys.exit(0)
