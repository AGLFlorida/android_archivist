#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { spawnSync } = require("node:child_process");

const archiveCjs = path.join(__dirname, "..", "dist", "archive.js");
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [archiveCjs, ...args], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
