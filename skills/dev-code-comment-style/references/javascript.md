# JavaScript 注释规范速查（Google JavaScript Style Guide 提炼）

> 来源: https://google.github.io/styleguide/jsguide.html §4.8（Comments）、§7（JSDoc 7.1–7.11）、§8.2–8.3、§9.1 | 调研日期 2026-10-12 | 注意：JS 指南已冻结，官方建议迁移 TypeScript | 关键句附英文原文

## A. 语法与格式

- 术语：comment = 实现注释；文档注释统称 JSDoc（`/** ... */`）
- 块注释与周围代码同层缩进；可用 `/* ... */` 或 `//`；多行 `/* ... */` 后续行以 `*` 对齐
- 禁止星号方框；**禁止用 `/** ... */` 写实现注释**。原文："Do not use JSDoc (`/** … */`) for implementation comments."
- `//` 前后要有空格；短类型声明/cast/参数名注释的 `/* */` 内侧留空格（如 `/** @type {number} */ (bar)`、`/* buzz= */ true`）
- 80 列限制适用于注释（豁免：长 URL、可复制 shell 命令、不可拆分长字符串）
- 注释（含 JSDoc）同样受缩进与列宽约束

## B. 必须写 JSDoc 的位置 + 豁免

- 总则："JSDoc is used on all classes, fields, and methods."
- **方法/命名函数**：参数和返回类型必须文档化（即使同签名 `@override` 也须显式写全部 `@param`/`@return`，为对齐 TypeScript）；`return` 类型在无非空 return 时可省；`this` 类型必要时文档化
- **属性**：类型必须文档化（private 属性描述可省，若名字+类型足够）；公共导出常量按属性处理
- **枚举与 typedef**：前置行必须有 `@enum`/`@typedef`；公共的还必须有描述
- **类/接口/record**：必须有描述及模板参数、实现接口、可见性等标签
- 匿名函数注解一般可选
- 描述可省略条件（方法/参数/返回）："may be omitted if they are obvious from the rest of the method's JSDoc or from its signature"（**类型不可省**）

## C. 可套用模板

方法（类型必须）：
```js
/**
 * Computes weight based on three factors:
 * - items sent
 * - items received
 * - last timestamp
 *
 * @param {!Array<string>} items The items to process.
 * @param {number=} timestamp A timestamp.
 * @return {?number} The computed weight, or null if none.
 */
function computeWeight(items, timestamp) { ... }
```

单行：`/** @const @private {!Foo} A short bit of JSDoc. */`（溢出为多行时必须转多行式，`/**` 与 `*/` 独占行）

参数名注释：`someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');`

类型断言（括号必需）：`const x = /** @type {number} */ (y);`

内联类型注明（仅需类型时）：`function /** string */ foo(/** number */ arg) { ... }`（内联**不得**写 `@return` 或函数描述）

## D. TODO 格式

- 无固定模板。TODO 仅作**最后手段**（处理告警时无法修复/非误报）："Otherwise, leave a TODO comment. This is a last resort. If you do this, do not suppress the warning. The warning should be visible until it can be taken care of properly."

## E. 语言特有规则

- JSDoc 用 Markdown 写（必要时可含 HTML）；纯文本缩进列表会被渲染成一行，列表**必须**用 Markdown 语法
- 标签大多独占一行且行首；禁止两个 `@param` 同行；简单标签（`@private`/`@const`/`@final`/`@export`）可同行合并；顺序无硬规则但须一致
- **换行**：block tag 续行缩进 4 空格；`@desc`/`@fileoverview` 续行不缩进；带类型的注解在 `{` 后断行
- 方法描述：动词短语、第三人称（隐含 "This method ..."）
- 文件级：`@fileoverview` 可选（多于单个类的文件建议）；版权与 `@author` 非必需也非推荐
- 类注释：`@implements`/`@extends`（`@extends` 仅泛型基类用）；`@interface`/`@record`/`@template TYPE`
- 类型注解一律大括号包裹；`!`/`?` 非空/可空修饰符放在类型前；原语默认非空；引用类型必须显式 `?`/`!`；模板参数必须写全（`!Array<string>`、`!Object<string, !User>`）；联合类型内**无空格**；`{` 后 `}` 前无多余空格
- 副作用导入必须注释说明原因
- 空 catch 块必须注释理由；switch fall-through 必须注释（典型 `// fall through`，最后一组除外）
- `@suppress` 施加在最窄合理范围；`@deprecated` 必须给调用方迁移指引。原文："A deprecation comment must include simple, clear directions for people to fix their call sites."
- 不推荐/废弃标签：`@author`/`@owner`（Not recommended）、`@code`（废弃，用反引号）、`@expose`/`@inheritDoc`（废弃）
- 匿名函数 JSDoc 一般可选；变量类型注解可放声明上一行或行内（不可混用两种风格）

## F. 反例

```js
/** @return {string} */ foo() { ... }   // BAD: 内联 JSDoc 写 @return
/** No function description allowed inline here. */ function bar() {}
// BAD: 两个 @param 同行
/** @param left @param right */
// BAD: 用 /** */ 写实现注释
/** Just a reminder to refactor later. */
// BAD: 纯文本缩进列表（会被压成一行）
// Computes weight based on:
//     items sent
```

## G. 审查清单

- [ ] 所有类/字段/方法有 JSDoc？参数与返回类型已标注？
- [ ] 枚举/typedef 有 `@enum`/`@typedef`？公共的有描述？
- [ ] 实现注释未误用 `/** */`？JSDoc 未用于实现注释？
- [ ] 多行 `/* */` 的 `*` 对齐？无方框？
- [ ] JSDoc 内列表用 Markdown 语法（防渲染压行）？
- [ ] 标签独占一行（简单标签合并有据）？
- [ ] `@override` 显式写了全部 `@param`/`@return`？
- [ ] 类型注解 `{}` 包裹、`!?` 前置、模板参数完整、联合类型无空格？
- [ ] `@deprecated` 有迁移指引？
- [ ] 空 catch / fall-through 有注释？
- [ ] `/* name= */` 参数名注释格式正确？

## H. 易误引的"不存在"规则

- **无** "JSDoc tag conventions" 逐标签小节（实际 §7.3 仅规定分行/合并；逐标签定义外链 Closure Compiler wiki）
- **无** "Where to use JSDoc" 独立节（总则见 §7 章首）
- **无** TODO 格式模板（TODO 仅是最后手段）
- `@public` 标签不存在（可见性标签为 `@private`/`@package`/`@protected`）
