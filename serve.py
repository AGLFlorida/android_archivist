# serve.py
import http.server
import socketserver
import os

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving files from {os.getcwd()} at http://localhost:{PORT}")
    httpd.serve_forever()
