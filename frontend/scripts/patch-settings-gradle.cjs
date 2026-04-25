const fs = require("node:fs");
const path = require("node:path");

const frontendRoot = path.resolve(__dirname, "..");
const settingsGradlePath = path.join(frontendRoot, "android", "settings.gradle");

const original = fs.readFileSync(settingsGradlePath, "utf8");
const eol = original.includes("\r\n") ? "\r\n" : "\n";

const managedBlockLines = [
  "extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->",
  "  def projectRoot = rootDir.getParentFile()",
  '  def normalizedRnConfigScript = new File(projectRoot, "scripts/rn-config-normalized.cjs")',
  "  def autolinkingLockFiles = files(",
  '    new File(projectRoot, "package.json"),',
  '    new File(projectRoot.getParentFile(), "package.json"),',
  '    new File(projectRoot.getParentFile(), "bun.lock"),',
  "    normalizedRnConfigScript",
  "  )",
  "",
  "  if (System.getenv('EXPO_USE_COMMUNITY_AUTOLINKING') == '1') {",
  "    ex.autolinkLibrariesFromCommand()",
  "  } else {",
  "    ex.autolinkLibrariesFromCommand(",
  '      ["node", normalizedRnConfigScript.absolutePath],',
  "      projectRoot,",
  "      autolinkingLockFiles",
  "    )",
  "  }",
  "}",
  "",
];

const managedBlock = managedBlockLines.join(eol);

const blockPattern =
  /extensions\.configure\(com\.facebook\.react\.ReactSettingsExtension\) \{ ex ->[\s\S]*?\n\}\s*(?=expoAutolinking\.useExpoModules\(\))/;

if (!blockPattern.test(original)) {
  console.error("Could not find the ReactSettingsExtension block in android/settings.gradle");
  process.exit(1);
}

const normalizedSource = original.replace(/\r\n/g, "\n");
const updatedNormalized = normalizedSource.replace(blockPattern, managedBlock.replace(/\r\n/g, "\n"));

if (updatedNormalized === normalizedSource) {
  console.log("android/settings.gradle already uses rn-config-normalized.cjs");
  process.exit(0);
}

const updated = eol === "\r\n" ? updatedNormalized.replace(/\n/g, "\r\n") : updatedNormalized;
fs.writeFileSync(settingsGradlePath, updated);

console.log("Updated android/settings.gradle to use scripts/rn-config-normalized.cjs");
