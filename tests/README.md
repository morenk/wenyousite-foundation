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

## 动态字体契约接入准备

[动态字体行为规范](../docs/thread-fonts-dynamic.md#跨仓验收用例)提供跨仓验收 ID，现阶段只有行为用例，没有新 HTTP／Markdown 夹具或动态协议执行结果。收到 Backend 已提交 SHA 后，新增独立动态测试组及带来源记录的原字节镜像，沿用精确提交、源路径、字节数和 SHA-256 校验；保留上节 v1 与固定快照策略测试，不用动态目录覆盖旧镜像。

新组按正文不可变身份与兼容投影、目录／按版本发现与状态、动态范围策略三部分关联生产者语料；具体文件名、字段、模式、错误码、分页及负缓存期限从该提交读取。重点覆盖非编译枚举的新身份、未知保源／有损写保护、停用与撤回差异、粘贴片段过滤及跨目录账本不重置。静态检查只验证 Schema、绑定和语料完整性，构建后创建 ID 的同会话流程、隔离写入 E2E、Android 网络／剪贴板及 RSS 由消费者执行，不增加仅断言文档措辞的测试或模拟成功的加载器。
