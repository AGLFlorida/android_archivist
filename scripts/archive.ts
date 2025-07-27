import { cpSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const [version, versionCode, bundleId] = process.argv.slice(2);

if (!version || !versionCode || !bundleId) {
  console.error('Usage: tsx archive.ts <version> <androidVersionCode> <bundleId>');
  process.exit(1);
}

let archiveRoot: string;
try {
  const configPath = join(__dirname, '..', '.archiveconfig.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  archiveRoot = config.archiveRoot;
  if (!archiveRoot) throw new Error();
} catch {
  console.error('Missing or invalid .archiveconfig.json with archiveRoot');
  process.exit(1);
}

const archiveDir = resolve(archiveRoot, bundleId, version, versionCode);

const projectRoot = process.cwd();
const aabSrc = join(projectRoot, 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
const mapSrc = join(projectRoot, 'android', 'app', 'build', 'outputs', 'mapping', 'release', 'mapping.txt');

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

cpSync(aabSrc, join(archiveDir, 'app-release.aab'));
cpSync(mapSrc, join(archiveDir, 'mapping.txt'));

console.log(`Copied to ${archiveDir}`);
