#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { spawn } = require("node:child_process");

const PORT = 8000;
const servePy = path.join(__dirname, "..", "serve.py");

const child = spawn("python3", [servePy], {
  stdio: ["inherit", "pipe", "inherit"],
});

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  const line = chunk.toString();
  if (line.includes(`http://localhost:${PORT}`)) {
    console.log(`\n  Open: \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`  Stop: Ctrl+C\n`);
  }
});

child.on("exit", (code) => process.exit(code ?? 0));
