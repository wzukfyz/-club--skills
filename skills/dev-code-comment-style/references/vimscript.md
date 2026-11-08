# Vim script 注释规范速查（Google Vim script Style Guide 提炼）

> 来源: 简版 https://google.github.io/styleguide/vimscriptguide.html（无注释规则）；重型版 https://google.github.io/styleguide/vimscriptfull.html（Style→Whitespace→Comments、Language Guide）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- Vim 注释符为双引号 `"`；注释文本前加一个空格。原文："Place a space after the `\"` before the comment text."（示例：`" I am a line comment.`）
- **禁止行内注释**。原文："Do not use inline comments."（部分命令视其为注释、部分视为未闭合引号，边界情况多）。替代做法："Where you would use an inline comment, put a line comment on the line above."
- 注释块中的空行也要带 `"`。原文："When leaving blank lines in comments, include the quote in the blank line."

## B. 必须写注释的位置

- 抛出的错误必须用 vimdoc doc comment 的 `@throws` 记录。原文："Always document thrown errors in vimdoc doc comments with the `@throws` directive."
- 文档一律用 vimdoc

## C. 可套用模板

```vim
" I am one continuous
"
" comment block.
```

## D. TODO 格式

- 两版指南**均无 TODO 格式规定**

## E. 语言特有规则

- 见 A/B；简版指南无任何注释规则，细则以重型版（vimscriptfull.html）为准

## F. 反例

```vim
let x = 1  " BAD: 行内注释禁止
```

## G. 审查清单

- [ ] 无行内注释（全部为整行 `"` 注释）？
- [ ] `"` 后有空格？
- [ ] 注释块空行保留 `"`？
- [ ] 抛出的错误有 `@throws` vimdoc 注释？

## H. 易误引的"不存在"规则

- 简版指南**无**任何注释规则（勿引用）；注释规则仅存在于重型版
