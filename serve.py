# serve.py
import http.server
import socketserver
import json
import os
import sys

CONFIG_FILE = '.archiveconfig.json'
PORT = 8000

try:
    with open(CONFIG_FILE) as f:
        config = json.load(f)
        archive_root = config.get("archiveRoot")
        if not archive_root:
            raise ValueError
except Exception:
    print("Missing or invalid .archiveconfig.json with 'archiveRoot'.")
    print("See README.md for setup instructions.")
    sys.exit(1)

# Change working directory to archiveRoot
if not os.path.isdir(archive_root):
    print(f"archiveRoot path does not exist or is not a directory: {archive_root}")
    sys.exit(1)

os.chdir(archive_root)

handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Serving {archive_root} at http://localhost:{PORT}")
    try:
      httpd.serve_forever()
    except KeyboardInterrupt:
      print("\nServer exiting...")
      httpd.server_close()
      sys.exit(0)
