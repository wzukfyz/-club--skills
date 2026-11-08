# C# 注释规范速查（Google C# at Google Style Guide 核对结论）

> 来源: https://google.github.io/styleguide/csharp-style.md（全文核对）| 调研日期 2026-10-12

## 核对结论

Google C# 风格指南**不含任何注释/文档注释规则**：

- 无 Comments 章节
- 无 XML 文档注释（`/// <summary>`）规则
- 无 `//` 风格、注释位置、TODO 格式规定
- 全文 "comment" 仅出现在示例代码内的解释性标注（非规则）

## 处理方式（C# 任务回退策略）

1. 遵循 SKILL.md 的通用速查 8 条（why>what、完整句、描述性语态等）
2. 项目自有规范优先；无项目规范时建议常规 C# 惯例（`///` XML 文档注释用于公共 API），并明确告知用户"此为通行惯例，非 Google C# 指南规定"
3. 指南相关精神：优先用命名常量、enum 参数、命名参数让参数自明（Argument Naming 节），而非依赖注释

## 易误引说明

- 不要引用"Google C# 注释规范"的任何具体条款——不存在
