import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

export interface ArchivePaths {
  archiveDir: string;
  aabSrc: string;
  mapSrc: string;
  jsSrcMapSrc: string;
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
    jsSrcMapSrc: join(
      projectRoot,
      "android",
      "app",
      "build",
      "intermediates",
      "sourcemaps",
      "react",
      "release",
      "index.android.bundle.packager.map",
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
  const { archiveDir, aabSrc, mapSrc, jsSrcMapSrc } = buildArchivePaths(
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
  cpSync(jsSrcMapSrc, join(archiveDir, `${versionCode}.sourcemap`));

  return archiveDir;
}

export function readXdgConfig(): { archiveRoot: string } | null {
  const base = process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
  const configPath = join(base, "android-archivist", "config.json");
  try {
    const raw = readFileSync(configPath, "utf-8");
    const cfg = JSON.parse(raw) as { archiveRoot?: string };
    return cfg.archiveRoot ? { archiveRoot: cfg.archiveRoot } : null;
  } catch {
    return null;
  }
}

if (require.main === module) {
  const [version, versionCode, bundleId] = process.argv.slice(2);

  if (!version || !versionCode || !bundleId) {
    console.error(
      "Usage: android-archivist <version> <androidVersionCode> <bundleId>",
    );
    process.exit(1);
  }

  const cfg = readXdgConfig();
  if (!cfg) {
    const xdgBase = process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
    console.error(
      `Missing config. Run \`npx android-archivist --setup\` or create:\n` +
        `  ${join(xdgBase, "android-archivist", "config.json")}\n` +
        `  with { "archiveRoot": "/path/to/archives" }`,
    );
    process.exit(1);
  }

  const archiveDir = runArchive(
    version,
    versionCode,
    bundleId,
    cfg.archiveRoot,
    process.cwd(),
  );
  console.log(`Copied to ${archiveDir}`);
}
