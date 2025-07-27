// scripts/archive.ts
import { cpSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const [version, versionCode, bundleId] = process.argv.slice(2);

if (!version || !versionCode || !bundleId) {
  console.error('Usage: ts-node archive.ts <version> <androidVersionCode> <bundleId>');
  process.exit(1);
}

const projectRoot = join(__dirname, '..');
const archiveDir = join(projectRoot, 'archive', bundleId, version, versionCode);

const aabSrc = join(projectRoot, 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
const mapSrc = join(projectRoot, 'android', 'app', 'build', 'outputs', 'mapping', 'release', 'mapping.txt');

const aabDest = join(archiveDir, 'app-release.aab');
const mapDest = join(archiveDir, 'mapping.txt');

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

cpSync(aabSrc, aabDest);
cpSync(mapSrc, mapDest);

console.log(`✅ Copied to archive/${bundleId}/${version}/${versionCode}/`);
