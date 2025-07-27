# Android Archive Tool

A simple CLI tool (TypeScript + Python) to archive Android release artifacts (`.aab`, `mapping.txt`) to a structured folder based on version, version code, and bundle ID.

---

## 📂 Folder Structure

```
archive/
  ├── com.example.myapp/
  │   ├── 1.3.0/
  │   │   └── 16/
  │   │       ├── app-release.aab
  │   │       └── mapping.txt
```

---

## ⚙️ Setup

### 1. Clone this repo and install deps:

```bash
npm install
```

### 2. Create a local `.archiveconfig.json` file in the root:

```json
{
  "archiveRoot": "/absolute/path/to/archive/root"
}
```

**Important**: This file is ignored via `.gitignore`, so it won't be committed to version control.

---

## 🚀 Usage

```bash
npx tsx scripts/archive.ts <version> <androidVersionCode> <bundleId>
```

Example:

```bash
npx tsx scripts/archive.ts 1.3.0 16 com.agl.nback
```

This will:

- Look for the AAB and mapping files in `android/app/build/outputs/...`
- Copy them to: `archiveRoot/com.agl.nback/1.3.0/16/`

---

## 🐍 Local File Server (Optional)

To serve local files via HTTP:

```bash
python3 serve.py
```

Serves from the current working directory on port 8000.

---

## 🛠 Makefile Helpers

```bash
make venv        # Create python venv in ./android_archive
make activate    # Echo activation command
make clean       # Remove the venv
```

---

## ❌ Common Errors

> "Missing or invalid .archiveconfig.json with archiveRoot"

Make sure you created `.archiveconfig.json` and it looks like:

```json
{
  "archiveRoot": "/your/path/here"
}
```

---

## 📦 Output

Artifacts are preserved in a deterministic and human-readable folder hierarchy.

---

## License

MIT

