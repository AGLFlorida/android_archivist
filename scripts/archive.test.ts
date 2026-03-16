import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildArchivePaths, runArchive } from "./archive";

test("buildArchivePaths returns correct structure", () => {
  const paths = buildArchivePaths(
    "/archive",
    "com.example.app",
    "1.0.0",
    "10",
    "/project",
  );

  assert.equal(paths.archiveDir, "/archive/com.example.app/1.0.0/10");
  assert.equal(
    paths.aabSrc,
    "/project/android/app/build/outputs/bundle/release/app-release.aab",
  );
  assert.equal(
    paths.mapSrc,
    "/project/android/app/build/outputs/mapping/release/mapping.txt",
  );
});

test("buildArchivePaths segments version, versionCode, and bundleId correctly", () => {
  const paths = buildArchivePaths("/root", "org.foo", "2.3.4", "99", "/cwd");

  assert.ok(paths.archiveDir.endsWith("org.foo/2.3.4/99"));
  assert.ok(paths.aabSrc.startsWith("/cwd"));
  assert.ok(paths.mapSrc.startsWith("/cwd"));
});

test("runArchive copies aab and mapping to archive directory", () => {
  const tmp = join(tmpdir(), `archive-test-${Date.now()}`);
  const archiveRoot = join(tmp, "archive");
  const projectRoot = join(tmp, "project");

  const aabDir = join(
    projectRoot,
    "android",
    "app",
    "build",
    "outputs",
    "bundle",
    "release",
  );
  const mapDir = join(
    projectRoot,
    "android",
    "app",
    "build",
    "outputs",
    "mapping",
    "release",
  );
  mkdirSync(aabDir, { recursive: true });
  mkdirSync(mapDir, { recursive: true });
  writeFileSync(join(aabDir, "app-release.aab"), "fake aab");
  writeFileSync(join(mapDir, "mapping.txt"), "fake mapping");

  const archiveDir = runArchive(
    "1.0.0",
    "10",
    "com.example.app",
    archiveRoot,
    projectRoot,
  );

  assert.equal(archiveDir, join(archiveRoot, "com.example.app", "1.0.0", "10"));
  assert.equal(
    readFileSync(join(archiveDir, "app-release.aab"), "utf-8"),
    "fake aab",
  );
  assert.equal(
    readFileSync(join(archiveDir, "mapping.txt"), "utf-8"),
    "fake mapping",
  );

  rmSync(tmp, { recursive: true, force: true });
});

test("runArchive creates nested archive directory if it does not exist", () => {
  const tmp = join(tmpdir(), `archive-test-${Date.now()}`);
  const archiveRoot = join(tmp, "deeply", "nested", "archive");
  const projectRoot = join(tmp, "project");

  const aabDir = join(
    projectRoot,
    "android",
    "app",
    "build",
    "outputs",
    "bundle",
    "release",
  );
  const mapDir = join(
    projectRoot,
    "android",
    "app",
    "build",
    "outputs",
    "mapping",
    "release",
  );
  mkdirSync(aabDir, { recursive: true });
  mkdirSync(mapDir, { recursive: true });
  writeFileSync(join(aabDir, "app-release.aab"), "");
  writeFileSync(join(mapDir, "mapping.txt"), "");

  assert.doesNotThrow(() =>
    runArchive("1.0.0", "1", "com.example", archiveRoot, projectRoot),
  );

  rmSync(tmp, { recursive: true, force: true });
});
