#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { spawnSync } = require("node:child_process");

const tsxBin = path.resolve(__dirname, "..", "node_modules", ".bin", "tsx");
const archiveTs = path.join(__dirname, "archive.ts");
const args = process.argv.slice(2);
const result = spawnSync(tsxBin, [archiveTs, ...args], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
