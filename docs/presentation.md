# 控件、内容与格式化呈现

机器事实源为 `experiences.controls`、`experiences.collections.content` 与 `experiences.formatting`。本规范统一跨端可观察语义，不取代平台组件、后端权限或业务状态机。

## 控件与表单

- 每个决定区域最多一个 primary；secondary 承载替代路径，quiet 承载低强调操作，destructive 只用于真实破坏性动作，link 只用于导航。
- pending 保持控件尺寸、阻止重复提交；disabled 仍须可读，独立图标控件必须有稳定名称。
- 字段顺序固定为 label、control、helper 或 error。placeholder 不替代 label，错误绑定具体字段，必填和选中态均提供非色彩线索。
- Tabs、筛选、排序和选择不混用语义；只有存在有效选择时才显示清除入口，改变选择不自动等同提交。

## 列表、详情与表面

- 内容槽位为标题、身份、时间、摘要、封面、标签、指标、状态和操作；未提供的数据可以省略，但不能由装饰占位。
- 列表用于扫描和进入，标题使用 body 600，摘要为可选预览；平台可选择扁平行或轻卡片。
- 详情用于连续阅读，内容标题使用 display 500；正文保持连续主表面，相关信息和工具才进入附属面板。
- 卡片不能嵌套卡片。帖子、动态等业务类型只声明与共同槽位不同的部分。

## 时间与数字

机器契约的普通 `contexts` 使用 `post`、`reply`、`moment`、`notification`、`direct-message`、`draft`、`profile`；精确 `contexts` 使用 `security`、`audit`、`wenyou-ledger`、`appointment`、`expiry`。按记录语义选择模式，普通通知若包含预约或到期信息，该时刻仍属于精确语境。`exactValueExposure` 保留渠道字段，`exposureFormat` 与 `exposurePrecision` 指定渠道展示完整日期；这里的 exact 不表示时分。

- 列表和详情使用同一时间算法：不足 60 秒“刚刚”，不足 60 分钟“N 分钟前”，不足 24 小时“N 小时前”，不足 72 小时“N 天前”。
- 普通内容包括帖子、回复、动态、通知、私信、草稿和普通个人资料时间。满 72 小时后，同年显示 `MM-dd`，跨年显示 `yyyy-MM-dd`；未来时间直接使用同年／跨年日期格式。
- 按用户本地时区计算。普通内容通过 `formatWenyouTime` 呈现正文，Web `title`、读屏名称和 Flutter Semantics 通过 `formatWenyouDate` 提供完整 `yyyy-MM-dd`，不含时分。页面恢复焦点或跨过显示阈值时刷新，不为每行建立高频计时器。
- 安全、审计、温油账务（含入账与支出）、预约和到期时刻使用精确模式，正文直接显示完整年月日及时分。`formatWenyouExactTime` 继续输出 `yyyy-MM-dd HH:mm`；已有秒级呈现继续保留秒，不能改用分钟级接口而丢失精度。举报、申诉处理记录、登录会话和定时公告归入相应精确语境。
- 上述仅为呈现规则，API、数据库和 `<time dateTime>` 等机器可读原始时间戳保持不变，不做数据截断或迁移。
- 计数不足一万显示精确整数；一万及以上使用最多一位小数的“万”，一亿及以上使用“亿”，去除 `.0`，并保留可访问的精确值。
