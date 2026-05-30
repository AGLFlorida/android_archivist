# @aglflorida/android-archivist

CLI tool to archive Android release artifacts (`.aab`, `mapping.txt`, sourcemap) into a structured folder hierarchy keyed by bundle ID, version, and version code.

## Installation

```bash
npm install -g @aglflorida/android-archivist
# or as a dev dependency in your project
npm install --save-dev @aglflorida/android-archivist
```

On first install, an interactive prompt will ask you for the archive root path. Config is stored at the XDG location:

```
$XDG_CONFIG_HOME/android-archivist/config.json
# defaults to:
~/.config/android-archivist/config.json
```

To configure manually, create that file with:

```json
{
  "archiveRoot": "/absolute/path/to/archive/root"
}
```

## Usage

```bash
android-archivist <version> <androidVersionCode> <bundleId>
```

Example:

```bash
android-archivist 1.3.0 16 com.example.myapp
```

This copies from `android/app/build/outputs/...` into:

```
archiveRoot/
  com.example.myapp/
    1.3.0/
      16/
        app-release.aab
        mapping.txt
        16.sourcemap
```

Or via `npx` without installing:

```bash
npx @aglflorida/android-archivist 1.3.0 16 com.example.myapp
```

## Local File Server

Serve the archive directory over HTTP for local browsing:

```bash
python3 serve.py
# → http://localhost:8000
```

Reads `archiveRoot` from the same XDG config.

## Development

### Prerequisites

- Node.js >= 22
- Python >= 3.12

```bash
npm install
pip install -r requirements-dev.txt
```

### Scripts

| Command | Description |
|---|---|
| `npm test` | TypeScript tests |
| `npm run test:py` | Python tests |
| `npm run lint` | Biome lint (TypeScript/JS) |
| `npm run lint:py` | Ruff lint (Python) |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run verify` | Full check (lint + test + typecheck) |
| `npm run archive` | Run archive script directly |

## Makefile

```bash
make venv     # Create Python venv in ./android_archive
make start    # Start the Python file server
make clean    # Remove venv
```

## License

MIT
