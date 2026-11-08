# Java 注释规范速查（Google Java Style Guide 提炼）

> 来源: https://google.github.io/styleguide/javaguide.html §1.1、§4.8.6（Comments）、§7（Javadoc）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- 术语：本指南中 "comment" 一律指实现注释；文档注释统一称 "Javadoc"
- 实现注释块与周围代码同层缩进；可用 `/* ... */` 或 `// ...`；多行 `/* ... */` 后续行必须以 `*` 开头并与上一行 `*` 对齐。原文："For multi-line `/* ... */` comments, subsequent lines must start with `*` aligned with the `*` on the previous line."
- 禁止星号方框。原文："Comments are not enclosed in boxes drawn with asterisks or other characters."
- `//` 与前后内容之间要有空格（允许多个）
- 缩进层级同时适用于代码和注释
- 可复制进 shell 的注释命令行不受 100 列限制

## B. 必须写 Javadoc 的位置 + 豁免

**最低要求**（原文）："At the *minimum*, Javadoc is present for every *visible* class, member, or record component"：
- 顶层类可见 = public；成员可见 = public 或 protected 且外围类可见；record component 可见随其 record

**豁免**：
- **自解释成员**（7.3.1）：简单明了的成员如 `getFoo()`，**当且仅当**除了 "the foo" 确实无可说时可选 Javadoc；不得借此省略读者通常需要的相关信息
- **override**（7.3.2）：覆盖超类型方法的方法不总是需要 Javadoc
- **非必需 Javadoc**（7.3.4）：其他类/成员按需添加；**凡是用实现注释描述类/成员整体目的/行为的地方，都应改写成 Javadoc**；非必需 Javadoc 不强制遵守 7.1/7.2 的格式规则（但推荐遵守）

## C. 可套用模板

传统 Javadoc（多行）：
```java
/**
 * Returns the customer ID.
 *
 * <p>Longer description paragraph.
 *
 * @param name the customer name
 * @return the customer ID
 * @throws IllegalArgumentException if name is null
 */
```

单行（仅当整块含标记能放进一行且无 block tag）：
```java
/** Return the customer ID. */
```

Markdown Javadoc（`///`）：
```java
/// Returns the customer ID.
///
/// @param name the customer name
/// @return the customer ID
```

## D. TODO 格式

- 格式："A `TODO` comment begins with the word `TODO` in all caps, a following colon, and a link to a resource that contains the context, ideally a bug reference." 说明文字用连字符 `-` 引出
- 示例：`// TODO: crbug.com/12345678 - Remove this after the 2047q4 compatibility window expires.`
- **禁止**以个人/团队为上下文。原文："Avoid adding TODOs that refer to an individual or team as the context"（反例：`// TODO: @yourusername - File an issue ...`）
- 未来型 TODO 必须给具体日期（"Fix by November 2005"）或具体事件（"Remove this code when all clients can handle XML responses."）

## E. 语言特有规则

- **summary fragment**：每个 Javadoc 块以简短摘要片段开头（在类/方法索引中是唯一出现的文本）；是名词/动词短语**而非完整句**：不得以 "A `Foo` is a..."、"This method returns..." 开头，不得是祈使句 "Save the record."；但按完整句大写和标点
- 常见错误：`/// @return the customer ID` 是错的，应写 `/// Returns the customer ID.` 或 `/// {@return the customer ID}`
- **block tag 顺序与内容**：`@param`、`@return`、`@throws`、`@deprecated` 按此顺序；四者**不得**空描述
- **block tag 换行缩进**：传统式续行相对 `@` 缩进 4 空格或更多；Markdown 式恰好 2 空格（4 空格会被 Markdown 当作代码块）
- **段落**：传统式段落间及 block tag 组前有只含对齐 `*` 的空行；除首段外每段第一词前紧接 `<p>`（其后无空格）；`<ul>`/`<table>` 等其他块级标签前**不加** `<p>`。Markdown 式用空行分段，无需 `<p>`
- 应用于类/包/模块声明的注解紧跟在 documentation block 之后，每行一条
- switch fall-through 必须注释（通常 `// fall through`）；最后一组不需要
- 空 catch 块必须注释说明理由
- 版权/许可证信息如需存在，放源文件结构第一节

## F. 反例

```java
/** Save the record. */           // BAD: 摘要写成完整祈使句
/// @return the customer ID       // BAD: @return 误当摘要
/**
 * @param name                     // BAD: block tag 空描述
 */
// TODO: @yourusername - ...      // BAD: TODO 填个人名
```

## G. 审查清单

- [ ] 每个可见类/成员/record component 都有 Javadoc？
- [ ] 摘要是片段式（非 "This method returns..."、非祈使句）且大写 + 句号？
- [ ] block tag 顺序 `@param→@return→@throws→@deprecated`？无空描述？
- [ ] 多行 `/* */` 的 `*` 对齐？无星号方框？
- [ ] 传统式段落/block tag 组前有空白 `*` 行？非首段有 `<p>`（且其后无空格）？
- [ ] 自解释成员豁免使用恰当（未滥省略读者需要的信息）？
- [ ] 描述整体目的的实现注释已升级为 Javadoc？
- [ ] switch fall-through 有注释？空 catch 有理由注释？
- [ ] TODO 用 `TODO: 链接 - 说明` 且无个人名？

## H. 易误引的"不存在"规则

- **无** 7.3.3 节（仅遗留空锚点）；**无** 7.4 节（指南到 7.3.4 结束）
- Java 的 TODO **不使用** `TODO(username):` 括号格式（那是 C++ 写法）
- **无** 独立弃用注释章节；`@deprecated` 仅作为 block tag 之一（Java 未规定弃用注释必须给迁移指引，JS/TS 才有此要求）
