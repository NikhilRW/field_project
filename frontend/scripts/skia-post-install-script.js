const fs = require("fs");
const path = require("path");

const nm = path.join(process.cwd(), "node_modules");

const patch = (pkgDir) => {
  const p = path.join(nm, pkgDir, "package.json");
  const json = JSON.parse(fs.readFileSync(p, "utf-8"));
  json.browser = { fs: false, path: false, os: false };
  fs.writeFileSync(p, JSON.stringify(json, null, 2));
  console.log(`[skia-post-install] Patched ${pkgDir}/package.json`);
};

patch("@shopify/react-native-skia");
patch("canvaskit-wasm");
