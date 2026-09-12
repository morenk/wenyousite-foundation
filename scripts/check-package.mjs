import assert from "node:assert/strict";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const packageJson = readJson(path.join(root, "package.json"));
const listFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? listFiles(path.join(directory, entry.name))
    : [path.join(directory, entry.name)]);

// 检查扩展名、字体容器签名及文本内容，防止改名的字体或旧依赖进入交付物。
function forbiddenAsset(file, content) {
  return /\.(?:ttf|otf|ttc|otc|woff2?|eot)$/iu.test(file)
    || /(?:^|\/)fonts\.css$/u.test(file)
    || /^(?:wOFF|wOF2|OTTO|ttcf|true|typ1)$/u.test(content.subarray(0, 4).toString("latin1"))
    || content.subarray(0, 4).equals(Buffer.from([0, 1, 0, 0]))
    || /Noto|LXGW|WenKai|Nunito|@fontsource|fontkit/iu.test(`${file}\n${content.toString("utf8")}`);
}

function invalidExports(exports, files) {
  const targets = (value) => typeof value === "string" ? [value]
    : Object.values(value ?? {}).flatMap(targets);
  return Object.hasOwn(exports, "./web/fonts.css")
    || targets(exports).some((target) => !target.startsWith("./") || !files.has(target.slice(2)));
}

// 包策略反向用例覆盖重新导出、依赖回流、无扩展名字体以及残留说明。
for (const [file, content] of [
  ["assets/legacy.woff2", ""],
  ["web/fonts.css", ""],
  ["assets/renamed.bin", "wOF2payload"],
  ["assets/renamed.bin", Buffer.from([0, 1, 0, 0, 1])],
  ["package.json", '{"dependencies":{"@fontsource-variable/legacy":"1.0.0"}}'],
  ["dist/legacy.js", 'export const family = "Legacy Noto";'],
]) assert.ok(forbiddenAsset(file, Buffer.from(content)), `包策略未拒绝 ${file}`);
assert.equal(forbiddenAsset("licenses/Lucide-ISC.txt", Buffer.from("ISC License")), false);
assert.equal(forbiddenAsset("dist/typography.js", Buffer.from('"system-ui", "sans-serif"')), false);
assert.ok(invalidExports({ "./web/fonts.css": "./web/fonts.css" }, new Set(["web/fonts.css"])));
assert.ok(invalidExports({ "./typography": { types: "./missing.d.ts" } }, new Set()));
assert.equal(invalidExports({ "./typography": "./dist/typography.js" }, new Set(["dist/typography.js"])), false);

// Flutter 通过 Git Tag 消费，单独覆盖其交付树以及 npm files 白名单中的原始目录。
const sourceFiles = [...packageJson.files, "packages/flutter"]
  .flatMap((relative) => {
    const full = path.join(root, relative);
    return fs.statSync(full).isDirectory() ? listFiles(full) : [full];
  });
for (const file of sourceFiles) {
  assert.equal(forbiddenAsset(path.relative(root, file), fs.readFileSync(file)), false, `源交付树包含字体残留：${file}`);
}
assert.doesNotMatch(fs.readFileSync(path.join(root, "packages/flutter/pubspec.yaml"), "utf8"), /^\s*fonts:/mu);

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "wenyou-foundation-pack-"));
try {
  const tarball = path.join(temporary, "foundation.tgz");
  execFileSync("pnpm", ["pack", "--out", tarball, "--json"], { cwd: root, stdio: "pipe" });
  const entries = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" }).trim().split("\n");
  assert.ok(entries.every((entry) => entry.startsWith("package/") && !entry.split("/").includes("..")), "归档路径必须位于 package 内");
  execFileSync("tar", ["-xzf", tarball, "-C", temporary]);
  const packedRoot = path.join(temporary, "package");
  const packedFiles = listFiles(packedRoot);
  const relativeFiles = new Set(packedFiles.map((file) => path.relative(packedRoot, file)));
  for (const file of packedFiles) {
    assert.equal(forbiddenAsset(path.relative(packedRoot, file), fs.readFileSync(file)), false, `tarball 包含字体残留：${file}`);
  }
  const packedPackage = readJson(path.join(packedRoot, "package.json"));
  const manifest = readJson(path.join(packedRoot, "foundation-manifest.json"));
  const contract = readJson(path.join(packedRoot, "contracts/foundation.v1.json"));
  assert.equal(invalidExports(packedPackage.exports, relativeFiles), false, "tarball 包含失效导出");
  assert.equal(packedPackage.version, packageJson.version);
  assert.equal(manifest.version, packedPackage.version);
  assert.equal(contract.version, packedPackage.version);
  assert.equal(contract.schemaVersion, 3);
  assert.equal(manifest.schemaVersion, contract.schemaVersion);
  assert.deepEqual(contract.fonts, []);
  assert.deepEqual(manifest.fonts, []);
  assert.equal(manifest.contractSha256, crypto.createHash("sha256").update(fs.readFileSync(path.join(packedRoot, "contracts/foundation.v1.json"))).digest("hex"));
  for (const [file, hash] of Object.entries(manifest.artifactSha256)) {
    if (file.startsWith("packages/flutter/")) continue;
    assert.ok(relativeFiles.has(file), `tarball 缺少清单产物 ${file}`);
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(packedRoot, file))).digest("hex"), hash, `tarball 产物哈希漂移 ${file}`);
  }
  assert.ok(relativeFiles.has("licenses/Lucide-ISC.txt"), "tarball 缺少图标许可证");
  const evidence = {
    version: packedPackage.version,
    schemaVersion: contract.schemaVersion,
    files: packedFiles.length,
    bytes: fs.statSync(tarball).size,
    sha256: crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex"),
    fonts: manifest.fonts,
    dependencies: packedPackage.dependencies,
    exports: Object.keys(packedPackage.exports),
    forbiddenAssets: 0,
    invalidExports: 0,
  };
  console.log(JSON.stringify(evidence, null, 2));
  console.log("实际 tarball、Flutter 交付树及包策略反向用例均通过");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
