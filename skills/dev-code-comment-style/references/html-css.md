# HTML/CSS 注释规范速查（Google HTML/CSS Style Guide 提炼）

> 来源: https://google.github.io/styleguide/htmlcssguide.html（General Meta Rules → Comments / Action Items；CSS Meta Rules → Section Comments）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- HTML 注释 `<!-- ... -->`；CSS 注释 `/* ... */`
- 本指南**不规定**注释缩进/对齐/行宽等格式细则

## B. 何处写注释（原则性、可选）

- "Explain code as needed, where possible." 注释说明：代码覆盖什么、目的是什么、为什么采用/偏好该方案
- 该条为**可选**。原文："(This item is optional as it is not deemed a realistic expectation to always demand fully documented code. Mileage may vary heavily for HTML and CSS code and depends on the project's complexity.)"

## C. 可套用模板

CSS 分节注释（节间空行分隔，可选）：
```css
/* Header */
...

/* Footer */
...
```

HTML TODO：
```html
<!-- TODO: Remove optional tags. -->
```

## D. TODO 格式

- 只用 `TODO` 关键字，不得用 `@@` 等其他格式。原文："Highlight todos by using the keyword `TODO` only, not other common formats like `@@`."
- 待办内容在冒号之后。原文："Append action items after a colon as in `TODO: action item`."

## E. 语言特有规则

- CSS 建议用分节注释将样式表分组、节间空行分隔（可选："Group sections by a section comment (optional)."）
- Parting Words：跟随所在文件既有风格（别人注释带井号框，你也照做）

## F. 反例

```html
<!-- @@ 需要修改 -->   <!-- BAD: 非 TODO 关键字 -->
```

## G. 审查清单

- [ ] TODO 均用 `TODO` 关键字 + 冒号格式？
- [ ] CSS 大文件有分节注释？
- [ ] 注释解释 what/purpose/why 而非复述？

## H. 易误引的"不存在"规则

- **无** 注释语法格式细则（缩进/行宽/方框禁令等均未规定）
- **无** 文档注释/实现注释之分
