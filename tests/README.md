# 共享验收用例

## RP 帖内身份语义

文件 thread-identity-semantics-fixtures.json 对应[帖内身份规范](../docs/thread-identities.md)，沿用稳定 ID、owners、given／when／then 的验收描述，覆盖当前／历史身份、仅头像设置、旧客户端确认、开关与撤权、同名、缓存、私密可见性和隔离验收；不定义 HTTP DTO，也不执行业务写入。

下面的静态检查同时覆盖下载与 RP 场景。通过只证明 JSON、结构与文档关联正确，消费任务仍须在真实实现测试中关联 ID，分别记录画面、旧客户端与隔离 E2E 结果。

## APP 下载语义

`app-download-semantics-fixtures.json` 对应[共享下载规范](../docs/app-downloads.md)，使用稳定 ID 和中文前置条件、动作、观察结果描述跨仓验收；不是 HTTP DTO、响应样本或 Foundation 运行时导出。Backend OpenAPI 是字段的唯一事实源，接入任务固定共享规范中的精确 Backend 提交，并在真实实现测试中关联相关用例 ID。

Foundation 交付只验证 JSON 可解析、场景结构、ID 唯一性和文档引用，再执行 `pnpm check`。本文件没有下载或网关执行器，不能将静态校验声称为匿名下载、限流、缓存或安装测试通过。Web／Mobile／Backend 各自负责列出的场景，写入和压力测试只使用已登记的隔离资源；真实云权限、画面与旧 APP 验收另列。

从仓库根目录执行以下静态检查；它不包含在现有的格式化测试中：

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
for (const file of ['app-download-semantics-fixtures.json', 'thread-identity-semantics-fixtures.json']) {
  const path = pathToFileURL(`${process.cwd()}/tests/${file}`);
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
  console.log(`${ids.length} 个 ${file} 语义用例静态检查通过`);
}
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
