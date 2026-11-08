# R 注释规范速查（Google R Style Guide / Tidyverse 继承）

> 来源: https://google.github.io/styleguide/Rguide.html（已改为 Tidyverse Style Guide 的 fork，仅列差异）| 继承来源: https://style.tidyverse.org/syntax.html#comments | 调研日期 2026-10-12 | 关键句附英文原文

## Google R 指南现状

- 在线 Google R 指南是 Tidyverse Style Guide 的 fork；原文："The rest of this document explains Google's primary differences with the Tidyverse guide"，除列出的差异外规则全部继承 Tidyverse
- Google 页面本身**无** Comments 章节（`#` 用法、大小写、行尾注释等规则均不在 Google 差异列表中）

## 继承自 Tidyverse 的注释规则

- 每行注释以注释符 + **一个空格**开头。原文："Each line of a comment should begin with the comment symbol and a single space: `#`"
- 数据分析代码中用注释记录**重要发现**与**分析决策**。原文："In data analysis code, use comments to record important findings and analysis decisions."
- 若必须靠注释解释代码在做什么 → 考虑重写代码使其更清晰。原文："If you need comments to explain what your code is doing, consider rewriting your code to be clearer."
- 注释比代码还多 → 考虑改用 R Markdown。原文："If you discover that you have more comments than code, consider switching to R Markdown."

## Google 侧的文档要求（非注释）

- 所有包应有包文档文件 `packagename-package.R`。原文："All packages should have a package documentation file, in a `packagename-package.R` file."

## 易误引说明

- **无** 完整句子/大小写/行尾注释间距规定（Tidyverse Comments 节未涉及，Google 未追加）
- 不要引用"Google R 注释规范"的具体条款——Google 页面未规定，规则来自 Tidyverse 继承
