const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const autolinkMirrorRoot = path.join(projectRoot, ".cache", "autolinked-node_modules");

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureJunction(linkPath, targetPath) {
  ensureDirectory(path.dirname(linkPath));

  if (fs.existsSync(linkPath)) {
    const stats = fs.lstatSync(linkPath);
    if (stats.isSymbolicLink()) {
      const currentTarget = path.resolve(path.dirname(linkPath), fs.readlinkSync(linkPath));
      if (path.normalize(currentTarget) === path.normalize(targetPath)) {
        return;
      }
    }

    fs.rmSync(linkPath, { recursive: true, force: true });
  }

  fs.symlinkSync(path.resolve(targetPath), linkPath, "junction");
}

function makePathReplacement(actualRoot, mirrorRoot) {
  return {
    actualBack: actualRoot,
    actualForward: actualRoot.replace(/\\/g, "/"),
    mirrorBack: mirrorRoot,
    mirrorForward: mirrorRoot.replace(/\\/g, "/"),
  };
}

function createPackageMirror(packageName, actualRoot) {
  const mirrorRoot = path.join(autolinkMirrorRoot, ...packageName.split("/"));
  ensureJunction(mirrorRoot, actualRoot);
  return mirrorRoot;
}

function replacePathPrefix(value, replacements) {
  if (typeof value !== "string") {
    return value;
  }

  for (const replacement of replacements) {
    if (value === replacement.actualBack || value.startsWith(`${replacement.actualBack}\\`)) {
      return `${replacement.mirrorBack}${value.slice(replacement.actualBack.length)}`;
    }

    if (value === replacement.actualForward || value.startsWith(`${replacement.actualForward}/`)) {
      return `${replacement.mirrorForward}${value.slice(replacement.actualForward.length)}`;
    }
  }

  return value;
}

function normalizeDeep(value, replacements) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeDeep(item, replacements));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeDeep(nestedValue, replacements)])
    );
  }

  return replacePathPrefix(value, replacements);
}

const rawConfig = execFileSync(
  process.execPath,
  [
    "--no-warnings",
    "--eval",
    "require('expo/bin/autolinking')",
    "expo-modules-autolinking",
    "react-native-config",
    "--platform",
    "android",
    "--json",
  ],
  {
    cwd: projectRoot,
    encoding: "utf8",
  }
);

const config = JSON.parse(rawConfig);

const replacements = [];

if (typeof config.reactNativePath === "string" && fs.existsSync(config.reactNativePath)) {
  replacements.push(
    makePathReplacement(
      config.reactNativePath,
      createPackageMirror("react-native", config.reactNativePath)
    )
  );
}

for (const dependency of Object.values(config.dependencies ?? {})) {
  if (!dependency?.name || typeof dependency.root !== "string" || !fs.existsSync(dependency.root)) {
    continue;
  }

  replacements.push(
    makePathReplacement(
      dependency.root,
      createPackageMirror(dependency.name, dependency.root)
    )
  );
}

replacements.sort((left, right) => right.actualBack.length - left.actualBack.length);

process.stdout.write(JSON.stringify(normalizeDeep(config, replacements)));
