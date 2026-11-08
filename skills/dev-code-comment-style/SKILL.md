---
name: dev-code-comment-style
description: 基于 Google Style Guides 提炼的代码注释规范，覆盖 16 种语言的注释编写与审查。当需要写注释、补文档注释、审查注释质量、确定 TODO 格式或编写 docstring/Javadoc/JSDoc 时使用。触发词：写注释、补注释、注释审查、注释规范、TODO 注释、docstring、JSDoc、comment style。
metadata:
  tags: [comment, docstring, code-review, style-guide]
  version: 1.0.0
  owner: 开源社团运维部
---

# 代码注释规范助手

基于 Google Style Guides（调研日期 2026-10-12）提炼的注释规范知识库，覆盖 16 种语言，支持写作与审查两种模式。

## 适用场景

- 需要给函数、类、模块补写文档注释（docstring / Javadoc / JSDoc）；
- 需要审查已有代码的注释质量，判断是否违规；
- 不确定某个语言的 TODO 注释该怎么写；
- 要给新模块统一注释风格。

以下情况不要用这个技能：

- 项目已有自己的注释规范——以项目规范为准，本技能只作补充参考；
- 只是问代码逻辑，与注释无关；
- 目标语言不在覆盖范围内（Swift、Kotlin、Dart），只能退回通用原则，不得臆造该语言的规则。

## 前置条件

- 无需安装依赖，规范文档以纯 Markdown 存放在 `references/` 下；
- 路径一律用 `{baseDir}` 占位符表示技能根目录，系统会自动替换为实际路径；
- **一次只读当前语言的这一份文档**，不要预读其他语言，避免占用上下文。

## 步骤

### 1. 识别目标语言

按扩展名路由：

| 语言 | 扩展名 / 判定 | 规范文档 |
|---|---|---|
| Python | `.py` | `references/python.md` |
| Java | `.java` | `references/java.md` |
| C++ | `.cpp` `.cc` `.cxx` `.hpp` `.h`（非 ObjC 头文件） | `references/cpp.md` |
| JavaScript | `.js` `.jsx` `.mjs` `.cjs` | `references/javascript.md` |
| TypeScript | `.ts` `.tsx` `.mts` `.cts` | `references/typescript.md` |
| Go | `.go` | `references/go.md` |
| Shell | `.sh` `.bash` | `references/shell.md` |
| Objective-C | `.m` `.mm`；`.h` 中含 `#import` / `@interface` / `@protocol` | `references/objective-c.md` |
| HTML / CSS | `.html` `.htm` `.css` | `references/html-css.md` |
| Haskell | `.hs` `.lhs` | `references/haskell.md` |
| Common Lisp | `.lisp` `.lsp` `.cl` | `references/common-lisp.md` |
| Vim script | `.vim` | `references/vimscript.md` |
| XML | `.xml` | `references/xml.md` |
| JSON | `.json` | `references/json.md` |
| C# | `.cs` | `references/csharp.md` |
| R | `.R` `.r` | `references/r.md` |

`.h` 既可能是 C++ 也可能是 Objective-C：出现 `#import`、`@interface`、`@protocol` 判为 Objective-C，否则按 C++ 处理。语言无法判断时询问用户，或按语法特征给出最接近语言的建议并说明推断依据。

### 2. 读取对应的规范文档

用 Read 工具读取 `{baseDir}/references/<语言>.md`，只读这一份。

### 3. 按模式执行

**写作模式**：套用文档 C 节给出的模板，同时遵守 A、B、D、E 节的规则，产出的注释必须能直接粘贴使用。

**审查模式**：按文档 G 节的审查清单逐项核对，逐条输出「违规项 → 违规内容 → 规则出处（语言文档节号）→ 修正建议」。

规则引用必须来自对应语言文档，不得凭记忆编造。各文档 H 节列出了常见的、实际上并不存在的规则，用来防止误引；引用前若不确定，重新读一遍文档核对。

### 4. 通用速查（跨语言共性）

快速问答，或只需要跨语言共性时，直接用下面八条，不必读语言文档：

1. **解释 why，不复述 what**——注释说明「为什么这么做」，不逐字描述代码；假定读者精通该语言。
2. **自文档化优先**——好命名胜过用注释解释晦涩名称，自描述的代码不需要注释。
3. **完整句规范**——完整句注释首字母大写、句号结尾；行尾短注释可放宽，但同一文件内必须一致。
4. **描述性语态**——文档注释用动词短语、隐含主语是对象本身（「Opens the file」，而非祈使句「Open the file」，也非「This function opens...」）。
5. **公共接口必有文档注释**——导出、公共、可见的类与函数必须有；自解释成员、override、测试代码可豁免。
6. **棘手代码必有实现注释**——复杂、非直观、易错的代码段前必须解释。
7. **行尾注释间距**——与代码至少隔 2 个空格，注释符后至少 1 个空格（Python / ObjC / Haskell / Lisp 明确要求）。
8. **禁止星号方框**——不得用星号或其他字符把注释框起来（Java / JS / TS 明文禁止）。

TODO 注释分派系，跨语言项目最容易出错：

| 语言 | 格式 | 示例 |
|---|---|---|
| C++ / Shell | `TODO(标识): 说明`，标识为 bug 号、人名或邮箱 | `// TODO(bug 12345): remove ...` |
| Java / Python | `TODO: 上下文链接 - 说明`，**禁止**填个人名或团队 | `// TODO: crbug.com/123 - Remove ...` |
| HTML / CSS | 只用 `TODO` 关键字 | `<!-- TODO: Remove optional tags. -->` |
| Common Lisp | `;; TODO(标识): 说明` | `;; TODO(b/1234567): ...` |
| JavaScript | 仅作最后手段，无固定模板 | — |
| Go / TypeScript | 指南未规定 | — |

C++、Java、Python 还有一条共有约束：「未来某日做某事」型 TODO 必须给出具体日期（Fix by November 2005）或具体触发事件（Remove this code when all clients can handle XML responses）。

## 异常处理

| 情况 | 处理方式 |
|---|---|
| 语言未覆盖（Swift / Kotlin / Dart 等） | 说明未覆盖，退回第 4 步的通用速查，不编造该语言规则 |
| 无法识别语言 | 询问用户；或给出最接近语言的建议并声明推断依据 |
| 项目自有规范与 Google 冲突 | 以项目规范优先，本技能只作补充参考 |
| Google 指南未规定的问题 | 明确说明「Google 指南未规定」，不臆造 |
| 多语言项目 | 逐语言读取对应文档，一次只读一个 |
| 引用规则时不确定 | 重新读取对应语言文档核对，不凭记忆输出 |

## 验收标准

- [ ] 写作模式下产出的注释可直接粘贴，且符合该语言文档的模板与格式；
- [ ] 审查模式下每条都给出「违规内容 + 规则出处（节号）+ 修正建议」；
- [ ] 所有规则引用都能在对应语言文档中找到原文，没有凭空编造；
- [ ] 未覆盖的语言已明确声明，没有套用其他语言的规则；
- [ ] 项目自有规范与 Google 冲突时，以项目规范为准。

## 参考资料

- [Python](references/python.md)
- [Java](references/java.md)
- [C++](references/cpp.md)
- [JavaScript](references/javascript.md)
- [TypeScript](references/typescript.md)
- [Go](references/go.md)
- [Shell](references/shell.md)
- [Objective-C](references/objective-c.md)
- [HTML / CSS](references/html-css.md)
- [C#](references/csharp.md)
- [Haskell](references/haskell.md)
- [Common Lisp](references/common-lisp.md)
- [Vim script](references/vimscript.md)
- [XML](references/xml.md)
- [JSON](references/json.md)
- [R](references/r.md)
