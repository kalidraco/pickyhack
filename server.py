#!/usr/bin/env python3
"""
PickyHack Root Server Entry Point
Delegates execution directly to src/backend/server.py
"""
import os
import sys

# Add src/backend to sys.path
backend_dir = os.path.join(os.path.dirname(__file__), 'src', 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from server import run_server

if __name__ == '__main__':
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nPickyHack server stopped.")
        sys.exit(0)
