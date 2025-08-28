#!/usr/bin/env python3
"""
Simple HTTP server to serve the frontend files during development
"""
import http.server
import socketserver
import os
import sys
from pathlib import Path

def main():
    # Change to the frontend directory
    frontend_dir = Path(__file__).parent
    os.chdir(frontend_dir)
    
    # Set default port
    port = int(os.getenv("FRONTEND_PORT", 3000))
    
    # Create a custom handler that serves index.html for all routes
    class CustomHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            # If the path doesn't have a file extension, serve index.html
            if '.' not in self.path or self.path.endswith('/'):
                self.path = '/index.html'
            return super().do_GET()
        
        def end_headers(self):
            # Add CORS headers for development
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    try:
        with socketserver.TCPServer(("", port), CustomHandler) as httpd:
            print(f"Frontend server running at: http://localhost:{port}")
            print(f"Serving files from: {frontend_dir}")
            print(f"Backend should be running at: http://localhost:8000")
            print("\nPress Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down frontend server...")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"Port {port} is already in use. Try a different port:")
            print(f"FRONTEND_PORT={port + 1} python serve.py")
        else:
            print(f"Error starting server: {e}")

if __name__ == "__main__":
    main()
