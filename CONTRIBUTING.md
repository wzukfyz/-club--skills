# 贡献指南

本仓库收录社团的 Agent Skills。每个技能是一个自包含目录，使用者通过 `gh skill install` **单独安装**，装完只得到自己选的那一个目录。所以整套规则都围绕一条原则展开：

> **技能之间互不依赖。** 任何依赖其他技能文件的写法，在单技能安装后都会断掉。

## 快速开始

1. 复制模板：`cp templates/SKILL.template.md skills/<prefix>-<name>/SKILL.md`
2. 填写 frontmatter 与正文
3. 执行 `node tools/build-readme.mjs`，把生成的表格一并提交
4. 执行 `node tools/validate.mjs`，退出码为 0
5. 提 PR，按 `.github/pull_request_template.md` 逐项自检

## 命名与前缀

目录名即 `name`，必须形如 `<prefix>-<语义>`：全小写，只含字母、数字与连字符，长度不超过 64，至少含一个连字符。

| 前缀 | 领域 |
|---|---|
| `ops-` | 运维值班、部署、监控、备份、故障处理 |
| `dev-` | 开发流程、代码评审、构建、测试 |
| `doc-` | 文档撰写、排版、归档 |
| `evt-` | 活动组织、报名、物料 |
| `sec-` | 安全、凭据管理、审计 |
| `ai-` | 模型调用、提示词、评测 |

新增前缀需要同时修改本表与 `tools/validate.mjs` 中的 `PREFIXES` 常量，走同一个 PR。

`metadata.tags` 用于检索，取单数名词，1–5 个；它不承担分类层级职责——本仓库不设 `group` 字段，也不允许在 `skills/` 下建分类目录。

## SKILL.md 规范

### frontmatter

```yaml
---
name: ops-data-backup
description: 用 restic 备份社团服务器到对象存储，含增量校验与恢复演练。当需要备份、恢复或核对备份完整性时使用。
metadata:
  tags: [backup, restic]
  version: 1.0.0
  owner: 运维部-张三
---
```

解析器只认一个很小的语法子集，越界写法会直接报错而不是猜你的意思：

| 写法 | 结果 |
|---|---|
| `key: value` | 允许 |
| `key:value`（冒号后无空格） | 报错 |
| `key: 值里面有: 冒号` | 允许，只在第一个「冒号 + 空格」处切分 |
| `key: 值里面有 # 井号` | 允许，`#` 只有出现在行首才算注释 |
| `key: "值"` | 引号被当作普通字符，值变成带引号的字符串 |
| `key: \|` 或 `key: >` | 报错，不支持块标量 |
| `key: [a, b]` | 仅 `metadata.tags` 允许 |
| 两空格缩进的嵌套 | 仅 `metadata` 下允许一层 |

所有值一律按字符串处理，**不做类型推断**——`version: 1.0` 得到的就是字符串 `1.0`，随后会因不是 SemVer 而报错。

| 字段 | 必填 | 约束 |
|---|---|---|
| `name` | 是 | 与目录名完全一致，见上文命名规则 |
| `description` | 是 | 10–1024 字符，单行，写清「做什么」+「何时触发」 |
| `metadata.tags` | 是 | 1–5 个，无重复，kebab-case |
| `metadata.version` | 是 | SemVer，不带 `v` 前缀，可带预发布标签 |
| `metadata.owner` | 是 | 2–40 字符，负责人或团队 |

> `metadata.version` 只用于 README 展示。`gh skill` 解析安装版本时走的是 **git tag**（最近 tag → 默认分支 HEAD），不读这个字段。

### 正文

| 章节 | 必填 | 说明 |
|---|---|---|
| `## 适用场景` | 是 | 何时该用、何时不该用 |
| `## 前置条件` | 否 | 没有就写「无」，不能留空 |
| `## 步骤` | 是 | 有序列表，每步可独立验证 |
| `## 异常处理` | 否 | 没有就写「无」，不能留空 |
| `## 验收标准` | 是 | 可勾选的判据 |

顺序固定，可选章节可以整节省略，但只要出现就必须落在上表的位置。末尾允许至多一个 `## 参考资料`，只用于列出 `references/` 下的文件链接。

除上述六个标题外不允许其他顶层 `##`；更细的分段请用 `###` 子标题。全文不超过 500 行，超出时把细节移入 `references/`。

## 目录与文件

```
skills/ops-data-backup/
├── SKILL.md          必需
├── LICENSE           派生技能必需
├── NOTICE            派生技能必需
├── scripts/          可选
├── references/       可选
└── assets/           可选
```

- 空目录不要提交（Git 也不会跟踪），更不要用 `.gitkeep` 占位；
- 技能目录内不允许隐藏文件或目录；
- 单文件不超过 2MB，单个技能总体积不超过 10MB——安装时是整目录拷贝，体积直接体现在别人机器上；
- 技能内的 `scripts/` 用什么语言都可以（Python / Shell / JS），仓库根 `tools/` 里的脚本才限定为 `.mjs`。

## 引入外部技能

**GitHub 上没有 LICENSE 文件的仓库默认是「保留所有权利」，法律上不能复制。** 这不是「没写就等于随便用」。

- 只接受上游许可为 **MIT / Apache-2.0 / BSD 系 / CC0** 的技能。CC-BY 系列面向文档，不接受；
- 上游没有 LICENSE 文件时，只能联系作者取得授权，或只借鉴思路自行重写（重写不侵犯版权，但不得照抄结构与措辞）；
- 派生技能必须在自己目录内附带两个文件，因为单技能安装不会带上仓库根的许可证：

```
skills/<name>/LICENSE   上游许可原文
skills/<name>/NOTICE    来源 URL、原作者、原许可、改动摘要、日期
```

校验脚本会检查这两个文件同时存在或同时缺席。在 PR 描述里写明上游仓库 URL 与许可类型，评审时逐项确认。

## 本地校验

| 命令 | 作用 |
|---|---|
| `node tools/validate.mjs` | 全量校验，输出 `路径:行号: 原因` |
| `node tools/build-readme.mjs` | 重新生成 README 技能表 |
| `node tools/build-readme.mjs --check` | 只比较不写入，不一致时打印 diff |
| `node --test` | 运行工具链自测 |

CI 会执行 `node --test` 与 `node tools/validate.mjs`，不安装任何依赖。

## 提交规范

使用 Conventional Commits，描述用简体中文，一个提交只表达一个意图：

```
feat(ops-data-backup): 增加备份完整性校验步骤
docs: 补充引入外部技能的许可检查
fix: 修正 README 安装命令中的作用域参数
```

跨技能的改动请拆成多个提交。

### PR 标题

本仓库只允许 **squash 合并**，PR 标题会成为 main 上的最终提交信息，因此标题必须符合同一套约定，CI 会逐字校验（`tools/check-pr-title.mjs`）：

- `type` 只能是 `feat` `fix` `docs` `refactor` `perf` `test` `build` `ci` `chore` `style` `revert`；
- 描述部分必须含简体中文，末尾不加句号；
- 整行不超过 100 字符；
- 机器人账号（`xxx[bot]`）的 PR 跳过标题检查。

本地可以预跑：

```
node tools/check-pr-title.mjs "feat: 增加备份完整性校验步骤"
```

## 发布

发布 = 打一个仓库级 tag，不是部署。`gh skill install` 解析版本时走 git tag，所以一个 tag 代表「某一时刻的整仓快照」；各技能的 `metadata.version` 独立演进，仅供展示，不与 tag 绑定。

1. 确认目标改动都已合入 main 且 CI 全绿；
2. Actions → `release` → Run workflow，输入不带 `v` 的版本号，例如 `1.0.0`；
3. 工作流会依次校验版本号格式、确认 tag 未被占用、跑一遍自测与仓库校验、打 tag、创建 Release，并在正文追加本次快照的技能清单。

需要精确复现某次安装时用 `--pin <tag 或 commit SHA>`，不要指望 `metadata.version`。

## 评审关注点

1. `description` 是否真的写了触发场景——它是 Agent 决定要不要加载这个技能的唯一依据，写成标题等于技能永远不会被用到；
2. 步骤是否可独立验证，有没有「适当处理」这类无法执行的表述；
3. 是否隐含依赖其他技能、或依赖作者本机才有的路径与账号；
4. 派生技能的 LICENSE 与 NOTICE 是否齐全、上游许可是否在白名单内。

## 维护者备注

### 配置必需检查时，不要带工作流前缀

`main` 分支由 ruleset `main-protection` 保护，必需检查两项，ruleset 里应填的值就是各 job 的显示名：

| 工作流 | 检查名（ruleset 中的 `context`） |
|---|---|
| `validate` | `结构与元数据` |
| `pr-title` | `PR 标题` |

必须从 Add checks 的 **Suggestions** 中选右侧带 `GitHub Actions` 标记的条目，保存后 API 会带上 `integration_id: 15368`，即绑定了来源应用。

**不要手打，也不要选「Add manually」。** 合并框里把检查显示成 `validate / 结构与元数据`，那个 `workflow / ` 前缀只是展示用，不属于 `context` 字符串。把它一起填进 ruleset，检查再绿也会被判 `Expected — Waiting for status to be reported`，PR 永久无法合并——而且报错只说「required status checks are expected」，很容易误判成 CI 没跑或分支不新。

确认方法：

```
gh api repos/<owner>/<repo>/rulesets/<id> \
  --jq '.rules[] | select(.type=="required_status_checks") | .parameters.required_status_checks'
```

如果返回的 `context` 里带 ` / ` 前缀，或者缺少 `integration_id`，就是配置错了，与 CI 无关。

### 发布相关

`release` 工作流需要 `contents: write`，是仓库里唯一带写权限的工作流；`validate` 与 `pr-title` 都只申请 `contents: read`。改动工作流权限时请保持这个划分。
