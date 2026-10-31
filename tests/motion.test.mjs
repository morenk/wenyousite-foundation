import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as interaction from "../dist/interaction.js";

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const contract = JSON.parse(read("contracts/foundation.v1.json"));
const fixture = JSON.parse(read("tests/motion-semantics-fixtures.json"));
const specification = readFileSync(new URL(fixture.specification, new URL("./motion-semantics-fixtures.json", import.meta.url)), "utf8");

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function atPointer(pointer) {
  assert.match(pointer, /^\/(?:[^~/]|~[01])+(?:\/(?:[^~/]|~[01])+)*$/u);
  return pointer.slice(1).split("/").reduce((value, part) => {
    const key = part.replaceAll("~1", "/").replaceAll("~0", "~");
    assert.ok(value !== null && typeof value === "object" && Object.hasOwn(value, key), `契约引用不存在：${pointer}`);
    return value[key];
  }, contract);
}

test("动效、反馈和浮层保持已发布来源的语义，不隐式改变运行时依赖", () => {
  assert.equal(fixture.kind, "consumer-acceptance");
  assert.equal(fixture.source.path, "contracts/foundation.v1.json");
  assert.match(fixture.source.tag, /^v\d+\.\d+\.\d+$/u);
  assert.match(fixture.source.commit, /^[a-f0-9]{40}$/u);
  assert.equal(fixture.source.hashFormat, "sha256-of-recursively-key-sorted-json");
  assert.deepEqual(Object.keys(fixture.source.sections).sort(), ["/experiences/feedback", "/experiences/overlays", "/motion"]);
  for (const [pointer, expected] of Object.entries(fixture.source.sections)) {
    assert.match(expected, /^[a-f0-9]{64}$/u);
    const actual = createHash("sha256").update(JSON.stringify(canonical(atPointer(pointer)))).digest("hex");
    assert.equal(actual, expected, `${pointer} 偏离 ${fixture.source.tag}；须先评审语义和发布依赖，不能只更新摘要`);
  }
  assert.ok(specification.includes(`\`${fixture.source.tag}\``));
  assert.ok(specification.includes(`\`${fixture.source.commit}\``));
});

test("Web 动效 Token 和交互导出与唯一机器事实源一致", () => {
  const css = read("web/tokens.css");
  const cssTokens = new Map();
  for (const [, name, value] of css.matchAll(/(--(?:motion-[\w-]+|ease-[\w-]+)):\s*([^;]+);/gu)) {
    assert.ok(!cssTokens.has(name), `动效 Token 重复定义：${name}`);
    cssTokens.set(name, value.trim());
  }
  assert.deepEqual(Object.fromEntries(cssTokens), {
    "--motion-fast": `${contract.motion.fastMs}ms`,
    "--motion-standard": `${contract.motion.standardMs}ms`,
    "--motion-slow": `${contract.motion.slowMs}ms`,
    "--ease-standard": contract.motion.standardEase,
    "--ease-exit": contract.motion.exitEase,
  });
  assert.deepEqual(interaction.MOTION_USAGE, contract.motion.usage);
  const mappings = {
    FEEDBACK_RESOURCE_STATES: "/experiences/feedback/resourceStates",
    FEEDBACK_MUTATION_STATES: "/experiences/feedback/mutationStates",
    FEEDBACK_INVARIANTS: "/experiences/feedback/invariants",
    FEEDBACK_PRESENTATION: "/experiences/feedback/presentation",
    FEEDBACK_WEB_PROFILE: "/experiences/feedback/web",
    FEEDBACK_MOBILE_PROFILE: "/experiences/feedback/mobile",
    OVERLAY_INVARIANTS: "/experiences/overlays/invariants",
    OVERLAY_TASKS: "/experiences/overlays/tasks",
  };
  for (const [name, pointer] of Object.entries(mappings)) {
    assert.deepEqual(interaction[name], atPointer(pointer), name);
  }
});

test("Flutter 生成时长逐项映射到机器契约，不新增第二套值", () => {
  const dart = read("packages/flutter/lib/src/foundation_tokens.dart");
  const motionClass = dart.match(/abstract final class WenyouFoundationMotion \{([^}]+)\}/u)?.[1];
  assert.ok(motionClass, "缺少 Flutter 动效生成类");
  const durations = Object.fromEntries([...motionClass.matchAll(/static const Duration (\w+) = Duration\(milliseconds: (\d+)\);/gu)].map(([, key, value]) => [key, Number(value)]));
  assert.deepEqual(durations, {
    fast: contract.motion.fastMs,
    standard: contract.motion.standardMs,
    slow: contract.motion.slowMs,
  });
  // 仅核对生成源映射；Flutter 编译、系统设置与真机帧数据由 Windows 消费者验证。
});

test("共享用例有唯一身份、有效契约引用及两端执行与证据责任", () => {
  assert.equal(fixture.cases.length, 20);
  const ids = fixture.cases.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  const evidenceTypes = new Set(["behavior", "visual", "performance", "accessibility", "lifecycle"]);
  const nonempty = (value) => assert.ok(typeof value === "string" && value.trim().length > 0);
  for (const item of fixture.cases) {
    assert.deepEqual(Object.keys(item).sort(), ["contractRefs", "evidence", "given", "id", "owners", "then", "when"]);
    assert.match(item.id, /^motion-[a-z]+(?:-[a-z]+)*$/u);
    assert.deepEqual(item.owners, ["web", "mobile"]);
    nonempty(item.given);
    for (const key of ["contractRefs", "when", "then", "evidence"]) {
      assert.ok(Array.isArray(item[key]) && item[key].length > 0, `${item.id}.${key}`);
      item[key].forEach(nonempty);
      assert.equal(new Set(item[key]).size, item[key].length, `${item.id}.${key} 重复`);
    }
    item.contractRefs.forEach(atPointer);
    item.evidence.forEach((type) => assert.ok(evidenceTypes.has(type), `${item.id} 未知证据：${type}`));
  }
});

test("文档验收矩阵与固定用例双向对应，不另建动效数值表", () => {
  const matrix = specification.match(/<!-- motion-cases:start -->([\s\S]*?)<!-- motion-cases:end -->/u)?.[1];
  assert.ok(matrix, "缺少消费者验收矩阵");
  const matrixIds = [...matrix.matchAll(/^\| `(motion-[a-z-]+)` \|/gmu)].map((match) => match[1]);
  assert.deepEqual(matrixIds.toSorted(), fixture.cases.map((item) => item.id).toSorted());
  assert.doesNotMatch(specification, /\b\d+(?:\.\d+)?\s*(?:ms|毫秒)|cubic-bezier\(/iu);
  for (const name of ["fastMs", "standardMs", "slowMs", "standardEase", "exitEase", "usage"]) {
    assert.ok(specification.includes(`motion.${name}`), `缺少既有角色引用：motion.${name}`);
  }
  for (const name of ["README.md", "docs/foundation.md", "docs/interaction.md", "docs/images.md", "docs/thread-fonts.md", "docs/platforms/web.md", "docs/platforms/mobile.md", "docs/deprecation-register.md", "tests/README.md"]) {
    const file = new URL(`../${name}`, import.meta.url);
    const links = [...read(name).matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/gu)].map((match) => new URL(match[1], file).href);
    assert.ok(links.includes(new URL("../docs/motion.md", import.meta.url).href), `${name} 未关联共享规范`);
  }
});
