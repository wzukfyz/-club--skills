# XML 注释规范速查（Google XML Document Format Style Guide 提炼）

> 来源: https://google.github.io/styleguide/xmlguide.html（Representation of XML document instances 第 9–11 条）| 调研日期 2026-10-12 | 原文为 MUST/SHOULD/MAY 规范级别

## A. 语法与格式

- 注释符号内侧留空白。原文："Comments SHOULD have whitespace following `<!--` and preceding `-->`."（理由：可读性）

## B. 注释的使用边界（核心规则）

- **不得承载真实数据**。原文："Comments MUST NOT be used to carry real data."（理由：Comments are often discarded by parsers.）
- **手写 XML 中可用于 TODO**。原文："Comments MAY be used to contain TODOs in hand-written XML."
- **公开传输文档中最好完全不用**。原文："Comments SHOULD NOT be used at all in publicly transmitted documents."

## C. 可套用模板

```xml
<!-- TODO: clarify the encoding rules -->
```

## D. TODO 格式

- 手写 XML 中允许 TODO 注释（无更细格式规定）

## E. 位置规则

- 注释只应出现在文档序言（prolog）或含子元素的元素中。原文："Comments SHOULD appear only in the document prolog or in elements that contain child elements."
- pretty-print 时像元素一样缩进换行
- 注释不应出现在含字符内容的元素中

## F. 反例

- 用注释存储配置/数据（解析器会丢弃）
- `<item>text <!-- comment --></item>`（字符内容元素内）

## G. 审查清单

- [ ] 注释未承载真实数据？
- [ ] 注释位于序言或有子元素的元素中？
- [ ] `<!--` 与 `-->` 内侧有空白？
- [ ] 公开传输文档无注释？

## H. 易误引的"不存在"规则

- 该指南针对 XML 文档格式设计，**无**代码注释语法细则；仅上述 3 条规则适用于注释
