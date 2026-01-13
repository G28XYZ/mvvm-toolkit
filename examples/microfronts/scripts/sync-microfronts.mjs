import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const args = new Set(process.argv.slice(2));

const manifestOnly = args.has("--manifest-only");
const copyOnly = args.has("--copy-only");

if (manifestOnly && copyOnly) {
  console.error("Use only one of --manifest-only or --copy-only.");
  process.exit(1);
}

const destArg = [...args].find((arg) => arg.startsWith("--dest="));
const dest = destArg ? destArg.split("=")[1] : "public";
const validDest = new Set(["public", "dist"]);

if (!validDest.has(dest)) {
  console.error(`Unsupported --dest value "${dest}". Use "public" or "dist".`);
  process.exit(1);
}

const shouldWriteManifest = !copyOnly;
const shouldCopy = !manifestOnly;

const skipDirs = new Set(["node_modules", "dist", "public", "src", "scripts"]);

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readPackageName = async (dirName) => {
  const pkgPath = path.join(root, dirName, "package.json");
  if (!(await fileExists(pkgPath))) {
    return dirName;
  }

  try {
    const pkgRaw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    return typeof pkg.name === "string" && pkg.name.trim().length > 0 ? pkg.name.trim() : dirName;
  } catch {
    return dirName;
  }
};

const listMicrofronts = async () => {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || skipDirs.has(entry.name)) continue;

    const marker = path.join(root, entry.name, "src", "microfront.tsx");
    if (await fileExists(marker)) {
      const packageName = await readPackageName(entry.name);
      items.push({ folder: entry.name, packageName });
    }
  }

  return items.sort((a, b) => a.packageName.localeCompare(b.packageName));
};

const writeManifest = async (items) => {
  const manifestPath = path.join(root, "public", "microfront.json");
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  const packages = items.map((item) => item.packageName);
  await fs.writeFile(manifestPath, `${JSON.stringify(packages, null, 2)}\n`, "utf8");
};

const copyDist = async (items) => {
  const targetRoot = path.join(root, dest, "microfront");
  await fs.mkdir(targetRoot, { recursive: true });

  for (const item of items) {
    const sourceDir = path.join(root, item.folder, "dist");
    if (!(await fileExists(sourceDir))) {
      console.warn(`Skipping ${item.folder}: dist folder not found.`);
      continue;
    }

    const targetDir = path.join(targetRoot, item.packageName);
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.cp(sourceDir, targetDir, { recursive: true });
  }
};

const run = async () => {
  const items = await listMicrofronts();

  if (shouldWriteManifest) {
    await writeManifest(items);
  }

  if (shouldCopy) {
    await copyDist(items);
  }
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
