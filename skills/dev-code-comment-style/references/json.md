# JSON 注释规范速查（Google JSON Style Guide 提炼）

> 来源: https://google.github.io/styleguide/jsoncguide.md（General Guidelines → Comments）| 调研日期 2026-10-12 | 关键句附英文原文

## 核心规则（仅一条）

- **JSON 对象中不得包含注释**。原文："No comments in JSON objects."
- 正文："Comments should not be included in JSON objects. Some of the examples in this style guide include comments. However this is only to clarify the examples."（指南示例中的注释仅为讲解，不代表允许）

## 写作/审查要点

- 任何 JSON 数据文件中不得出现 `//`、`/* */` 或其他注释
- 需要说明字段含义时：放 README、JSON Schema（`description` 字段）或旁挂 .md 文档，而不是注释

## 易误引说明

- 虽然文件名为 jsoncguide，该指南**未**规定 JSONC（带注释 JSON）语法或例外——不要以本指南为 JSONC 背书
