import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface ArchivePaths {
  archiveDir: string;
  aabSrc: string;
  mapSrc: string;
}

export function buildArchivePaths(
  archiveRoot: string,
  bundleId: string,
  version: string,
  versionCode: string,
  projectRoot: string,
): ArchivePaths {
  return {
    archiveDir: resolve(archiveRoot, bundleId, version, versionCode),
    aabSrc: join(
      projectRoot,
      "android",
      "app",
      "build",
      "outputs",
      "bundle",
      "release",
      "app-release.aab",
    ),
    mapSrc: join(
      projectRoot,
      "android",
      "app",
      "build",
      "outputs",
      "mapping",
      "release",
      "mapping.txt",
    ),
  };
}

export function runArchive(
  version: string,
  versionCode: string,
  bundleId: string,
  archiveRoot: string,
  projectRoot: string,
): string {
  const { archiveDir, aabSrc, mapSrc } = buildArchivePaths(
    archiveRoot,
    bundleId,
    version,
    versionCode,
    projectRoot,
  );

  if (!existsSync(archiveDir)) {
    mkdirSync(archiveDir, { recursive: true });
  }

  cpSync(aabSrc, join(archiveDir, "app-release.aab"));
  cpSync(mapSrc, join(archiveDir, "mapping.txt"));

  return archiveDir;
}

if (require.main === module) {
  const [version, versionCode, bundleId] = process.argv.slice(2);

  if (!version || !versionCode || !bundleId) {
    console.error(
      "Usage: tsx archive.ts <version> <androidVersionCode> <bundleId>",
    );
    process.exit(1);
  }

  let archiveRoot: string;
  try {
    const configPath = join(__dirname, "..", ".archiveconfig.json");
    const config = JSON.parse(readFileSync(configPath, "utf-8")) as {
      archiveRoot?: string;
    };
    archiveRoot = config.archiveRoot ?? "";
    if (!archiveRoot) throw new Error();
  } catch {
    console.error("Missing or invalid .archiveconfig.json with archiveRoot");
    process.exit(1);
  }

  const archiveDir = runArchive(
    version,
    versionCode,
    bundleId,
    archiveRoot,
    process.cwd(),
  );
  console.log(`Copied to ${archiveDir}`);
}
