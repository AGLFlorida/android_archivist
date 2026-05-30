import http.server
import json
import os
import socketserver
import sys
from pathlib import Path

PORT = 8000


def xdg_config_path() -> Path:
    base = os.environ.get("XDG_CONFIG_HOME") or (Path.home() / ".config")
    return Path(base) / "android-archivist" / "config.json"


def load_archive_root() -> str:
    config_path = xdg_config_path()
    try:
        with open(config_path) as f:
            cfg = json.load(f)
        root = cfg.get("archiveRoot", "")
        if not root:
            raise ValueError("archiveRoot is empty")
        return root
    except Exception:
        print(f"Missing or invalid config at {config_path}.")
        print("Run `npx android-archivist --setup` or create the config manually.")
        sys.exit(1)


def serve(archive_root: str, port: int = PORT) -> None:
    if not os.path.isdir(archive_root):
        print(f"archiveRoot does not exist or is not a directory: {archive_root}")
        sys.exit(1)

    os.chdir(archive_root)
    handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving {archive_root} at http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer exiting...")
            httpd.server_close()
            sys.exit(0)


if __name__ == "__main__":
    serve(load_archive_root())
