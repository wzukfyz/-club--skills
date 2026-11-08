# TypeScript 注释规范速查（Google TypeScript Style Guide 提炼）

> 来源: https://google.github.io/styleguide/tsguide.html "Comments and documentation" 章及散落规则 | 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- 两类注释："There are two types of comments, JSDoc (`/** ... */`) and non-JSDoc ordinary comments (`// ...` or `/* ... */`)."
  - `/** JSDoc */` 写**文档**（给代码使用者看的内容）
  - `//` 写**实现注释**（只与实现相关的内容）
- **多行注释必须用多个 `//`，不得用 `/* */` 块**。原文："Multi-line comments... *must* use multiple single-line comments (`//`-style), not block comment style (`/* */`)."
- 禁止星号方框
- JSDoc 单行溢出为多行时必须转多行式（`/**` 与 `*/` 独占行）
- JSDoc 必须 well-formed（工具会提取元数据做校验与优化）

## B. 必须写文档的位置 + 豁免

- 应文档化**所有顶层导出**。原文："Use `/** JSDoc */` comments to communicate information to the users of your code."
- 同时应文档化所有（无论是否导出）"purpose is not immediately obvious from their name" 的属性与方法（由 reviewer 判断）
- 豁免：仅供工具消费的导出符号（如 `@NgModule` 类）不要求注释
- `@param`/`@return` 仅在**补充信息**时才写。原文："`@param` and `@return` lines are only required when they add information, and *may* otherwise be omitted."

## C. 可套用模板

函数（TS 中不写类型）：
```ts
/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param arg A number to do something to.
 */
function doSomething(arg: number) { ... }
```

单行：`/** This short jsdoc describes the function. */`

参数属性（constructor 参数属性）：
```ts
/**
 * @param percolator The percolator used for brewing.
 */
constructor(private percolator: Percolator) {}
```

普通字段：`/** The bean that will be used in the next call to brew(). */`

参数名注释：`someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');`

## D. TODO 格式

- **指南全文无 TODO 规定**（不要引用 JS 或 C++ 的 TODO 格式作为 TS 规范）

## E. 语言特有规则

- **类型注解冗余原则**。原文："JSDoc type annotations are redundant in TypeScript source code. Do not declare types in `@param` or `@return` blocks, do not write `@implements`, `@enum`, `@private`, `@override` etc. on code that uses the `implements`, `enum`, `private`, `override` etc. keywords."
- 反对复述式注释。原文："Avoid comments that just restate the parameter name and type"（反例：`/** @param fooBarService The Bar service for the Foo application. */`）
- 方法描述：动词短语、第三人称（隐含 "This method ..."）
- 类注释：提供何时/如何使用及正确使用注意事项；构造器上的文字描述可省
- **JSDoc 必须写在装饰器之前**。原文："please make sure to write the JsDoc before the decorator"（禁止夹在装饰器与声明之间）
- JSDoc 用 Markdown（必要时可含 HTML）；标签大多独占一行；续行缩进 4 空格；`@desc`/`@fileoverview` 续行不缩进
- 版权信息如需则放在文件顶部 JSDoc（`@fileoverview` 位于版权之后、import 之前）
- **禁用** `@ts-ignore` 及变体 `@ts-expect-error`/`@ts-nocheck`（测试中可用 `@ts-expect-error` 但一般不应）；替代：cast 到期望类型/any + 解释性注释，或抑制 lint 警告并说明理由
- 类型/非空断言：局部可确信安全时应加注释解释（`// x is a Foo, because ...`）；理由显然时可不加
- 空 catch 块必须注释理由；调用方已知会抛非 Error 的坏 API 须注释指出来源
- `@deprecated` 必须给调用方迁移指引。原文："A deprecation comment must include simple, clear directions for people to fix their call sites."
- 参数名注释格式：`/* name= */ value`（值前、带 `=`）；旧式值后省略 `=` 的写法同文件内可继续使用以保持一致

## F. 反例

```ts
/** @param fooBarService The Bar service for the Foo application. */  // BAD: 复述参数名
/** @param {number} arg ... */       // BAD: TS 中 JSDoc 写类型（冗余）
/* This is not fine */              // BAD: 多行实现注释用 /* */
@Component({...})
/** Description */                   // BAD: JSDoc 在装饰器之后
function f() {}
// @ts-ignore                       // BAD: 禁用
```

## G. 审查清单

- [ ] 所有顶层导出有 JSDoc？
- [ ] 非显而易见的属性/方法（含未导出）有文档？
- [ ] 文档用 `/** */`、实现注释用 `//`，未混用？
- [ ] 多行注释全部用 `//`（无 `/* */` 块）？
- [ ] JSDoc 中无冗余类型注解、无与关键字重复的标签？
- [ ] `@param`/`@return` 只在补充信息时出现？
- [ ] JSDoc 位于装饰器之前？
- [ ] 无 `@ts-ignore`/`@ts-nocheck`？
- [ ] 断言处有安全解释注释（理由不显然时）？
- [ ] `@deprecated` 有迁移指引？

## H. 易误引的"不存在"规则

- **全文无 TODO 内容**（JS 指南的"TODO 最后手段"规则不适用于 TS）
- **无** JSDoc 标签参考附录（不同于 JS 指南 §9.1）
- **无** JSDoc 类型语法规定（相反：类型注解冗余、禁止写入）
