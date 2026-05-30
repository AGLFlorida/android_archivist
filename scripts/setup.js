#!/usr/bin/env node

// Interactive XDG setup — run explicitly via `android-archivist-init` or `npm run setup`.
// Config is written to: $XDG_CONFIG_HOME/android-archivist/config.json
//                    or: ~/.config/android-archivist/config.json

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const xdgBase =
  process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");
const configDir = path.join(xdgBase, "android-archivist");
const configFile = path.join(configDir, "config.json");

function readExistingConfig() {
  try {
    const raw = fs.readFileSync(configFile, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const existing = readExistingConfig();
if (existing?.archiveRoot) {
  console.log(
    `android-archivist: config already exists at ${configFile} — skipping setup.`,
  );
  process.exit(0);
}

if (!process.stdout.isTTY) {
  console.error(
    `android-archivist: setup requires an interactive terminal.\n` +
      `Create ${configFile} manually with { "archiveRoot": "/path/to/archives" }.`,
  );
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "android-archivist: Enter the path where archives will be stored\n  archiveRoot: ",
  (answer) => {
    rl.close();
    const archiveRoot = answer.trim();
    if (!archiveRoot) {
      console.error("android-archivist: No path provided — aborting.");
      process.exit(1);
    }
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(
      configFile,
      `${JSON.stringify({ archiveRoot }, null, 2)}\n`,
      "utf-8",
    );
    console.log(`android-archivist: config saved to ${configFile}`);
  },
);
