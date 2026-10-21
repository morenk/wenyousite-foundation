# 共享验收用例

## APP 下载语义

`app-download-semantics-fixtures.json` 对应[共享下载规范](../docs/app-downloads.md)，使用稳定 ID 和中文前置条件、动作、观察结果描述跨仓验收；不是 HTTP DTO、响应样本或 Foundation 运行时导出。Backend OpenAPI 是字段的唯一事实源，接入任务固定共享规范中的精确 Backend 提交，并在真实实现测试中关联相关用例 ID。

Foundation 交付只验证 JSON 可解析、场景结构、ID 唯一性和文档引用，再执行 `pnpm check`。本文件没有下载或网关执行器，不能将静态校验声称为匿名下载、限流、缓存或安装测试通过。Web／Mobile／Backend 各自负责列出的场景，写入和压力测试只使用已登记的隔离资源；真实云权限、画面与旧 APP 验收另列。

从仓库根目录执行以下静态检查；它不包含在现有的格式化测试中：

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const path = pathToFileURL(`${process.cwd()}/tests/app-download-semantics-fixtures.json`);
const fixture = JSON.parse(readFileSync(path, 'utf8'));
const doc = readFileSync(new URL(fixture.specification, path), 'utf8');
const ids = fixture.cases.map(c => c.id);
assert(ids.length > 0);
assert.equal(new Set(ids).size, ids.length);
for (const c of fixture.cases) {
  assert.match(c.id, /^[a-z]+(?:-[a-z]+)*$/);
  assert.deepEqual(Object.keys(c).sort(), ['given', 'id', 'owners', 'then', 'when']);
  assert(c.owners.length && c.owners.every(o => ['web', 'mobile', 'backend', 'governance'].includes(o)));
  assert([c.given, c.when, ...c.then].every(s => typeof s === 'string' && s.length));
  assert(c.then.length && doc.includes('`' + c.id + '`'));
}
console.log(`${ids.length} 个下载语义用例静态检查通过`);
JS
```

## 时间格式化回归

`pnpm test:formatting` 在独立 Node 进程的 `UTC`、`Asia/Shanghai` 与 `America/New_York` 时区运行 `formatting-fixtures.json`；`pnpm check` 包含此检查。共享用例覆盖 60 秒、60 分钟、24 小时、72 小时边界、未来（含 1 毫秒未来）、跨年、UTC 输入的本地日期及夏令时。JavaScript 另外验证无效输入、Date/毫秒输入和不修改原始时间值。

Dart 使用同一份 JSON 及生成的纯 Dart 格式化模块，无需启动 Flutter。已有 Dart SDK 的 Linux/macOS 环境在仓库根目录执行：

```sh
TZ=UTC dart tests/formatting_test.dart
TZ=Asia/Shanghai dart tests/formatting_test.dart
TZ=America/New_York dart tests/formatting_test.dart
```

Dart 接口只接受有效 `DateTime`，无效字符串属于上游解析职责，因此不复刻 JavaScript 字符串输入的占位测试。没有 Dart SDK 时必须在交付中说明未执行，不能以 JS 通过声称跨语言运行验收完成。

## 音频候选定向验证

`pnpm test:audio` 仅覆盖音频体验 Schema 的有效与拒绝用例、Web／Flutter 导出和清单哈希、三个新增图标与固定 Lucide 资产一致性、既有 Token 复用，以及 Backend 精确提交语料及校验和。该入口不运行全量 `pnpm check`；合并授权后全量入口会包含这些音频回归。

跨端播放器交互与真实画面需各消费者自行验证，本仓库检查不能代替。

## 主题帖字体协议测试镜像

`pnpm test:text-font` 校验 `fixtures/text-font/source.json` 固定的 Backend 提交与六份原字节镜像，验证当前目录身份属于正文 Schema，并保留目录外的已退役历史身份、主要设计语言和就绪状态、未知身份／属性／跨行／颜色格式被解析结果 Schema 拒绝，运行策略 v2 的严格 Schema／manifest 绑定及无效策略拒绝，以及四种读取投影、写入保护和运行策略语料的完整性。此入口纳入 `pnpm check`；测试不运行生产者 Markdown 解析器或 HTTP，也不把源码字符串的语法验证等同于解析结果 Schema 校验。

镜像仅置于测试目录，不进入 Foundation 运行时包、Token 或公开导出。目录只从记录中的 Backend 精确 SHA 同步，不能手改镜像添加字体或更新资源状态；消费者直接固定 Backend 来源，不升级 Foundation 未发布提交。大型 manifest、退役审计和生成索引只登记来源哈希／长度，旧 manifest 另以 `legacyManifest` 保留精确提交及摘要，交接时从同提交 `git show` 核对索引描述符、目录和预算一致；CI 不声称联网重新核验远端资源。策略夹具的窗口、退避、Retry-After、SFNT 估算、快照及 `transferCases` 场景供消费者执行；传输轨迹包含 100 秒持续下载、idle／总截止、排队、取消与元数据超限，`complete` 只表示传输阶段完成；本仓不复制运行调度器，静态校验不代表流式元数据限长、恢复调度或原生资源生命周期已验收。

实际 Markdown 投影、字体／颜色保存保护、剪贴板、编辑往返、可见字符回退、资源完整性／预算、浏览器与 Flutter 设备画面由消费者用同一语料执行。完整接入与成本证据边界见[正文字体规范](../docs/thread-fonts.md)。

## 动态字体契约检查

`pnpm test:text-font` 同时运行 `text-font.test.mjs` 与 `text-font-dynamic.test.mjs`，并纳入 `pnpm check`。动态组的 `fixtures/text-font-dynamic/source.json` 固定 Backend `62a0313a75c85e42dfa39cd09b7cc90ae5c34186`，七份生产者原字节镜像分别覆盖正文 Schema／投影写入语料、状态刷新账本语料、manifest Schema、运行策略 JSON／Schema、历史导入映射；按精确提交、源路径、长度及 SHA-256 校验，OpenAPI 保留摘要及下述审计枚举投影，其余源文档登记摘要，不复制大型完整接口文档。旧六份镜像及其来源不改动。

新组验证导入表外的合法版本身份、非法解析结果、混合正文及旧端覆盖预期、selectable／pasteAllowed／renderAllowed 区别、截页与负缓存值、严格 v3 形状、11 个可收紧预算范围的下界／上界／越界／小数拒绝、跨发布账本预期、清单结构和历史导入身份。新增跨协议注册夹具检查，核对来源 manifest 绑定、保留 WYF1 alias 和两次输入身份／字节相同、生产者零新增尝试预期；同时拒绝错误长度或任意 family。清单合成样本仅用于结构验证，不是真实资源；Schema 不证明 Unicode 范围并集、角色格式、实际字节／SHA 或状态网关正确。静态投影和写入语料检查不执行生产者 Markdown 解析器、HTTP 或事务锁。

[动态字体验收矩阵](../docs/thread-fonts-dynamic.md#跨仓验收用例)保留 17 个跨仓 ID，关联构建后新版本同会话使用、状态与缓存、隔离上传发布、Android 网络／剪贴板／RSS 等真实流程。固定 Backend 提交已实现运行时，治理确认后端检查及完整隔离 E2E／清理通过；这些运行场景未由 Foundation 重跑，公共部署与真实跨端同会话验收另行记录，不能将静态检查视为动态功能验收。后续生产者更新须整体同步明确提交，消费者负责对应真实执行及失败清理。

`legacyRoutingRules`、9 条 `legacyRoutingCases` 与 6 条 `legacyCapabilityCases` 固定 v1 映射状态及防降级预期：同会话激活后只走 v2 网关，无旧 manifest 请求，404／断网保留最近可信状态，墓碑压过迟到响应和能力降级；来源标记保持。Foundation 核对映射和语料，不执行消费者路由器或声称旧公共字节可撤回。

`audit-enums.json` 是已提交 OpenAPI 的可追溯投影：JSON Pointer 为键，值为未修改的完整枚举数组，按 UTF-8、两空格缩进和末尾换行保存。`source.json.projections` 记录六个指针、OpenAPI 原文件摘要及投影字节／摘要；同步时从同一 Git SHA 核对每个指针值。测试验证三处 action／targetType 的枚举一致、八个 TEXT_FONT 动作及 TEXT_FONT 目标存在，不改变七份字体原字节镜像的口径，也不复制审计执行器。
