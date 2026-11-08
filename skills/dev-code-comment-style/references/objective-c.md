# Objective-C 注释规范速查（Google Objective-C Style Guide 提炼）

> 来源: https://google.github.io/styleguide/objcguide.md ## Comments（File / Declaration / Implementation / Disambiguating Symbols / Object Ownership）及散落规则 | 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- `//` 或 `/* */`；**鼓励 Doxygen 风格**文档注释（Xcode 可解析展示），项目内用法一致
- 行尾注释与代码至少隔 2 空格。原文："End-of-line comments should be separated from the code by at least 2 spaces."
- 标点/拼写/语法：完整句、正确大写与标点；行尾短注释可较不正式但风格一致；为下一位读者而写
- 符号引用：避免歧义时用反引号/竖线包住变量名与符号，优于引号或内联命名；Doxygen 中用 `@c` 等宽命令
- 风格例外标记：行末 `// NOLINT` 或上一行行末 `// NOLINTNEXTLINE`；`//` 与 `NOLINT*` 之间恰一个空格

## B. 必须写注释的位置 + 豁免

- **每个非平凡接口（public 与 private）都必须有注释**。原文："Every non-trivial interface, public and private, should have an accompanying comment describing its purpose and how it fits into the larger picture."
- 头文件中所有非平凡顶层声明（接口、category、protocol）必须注释，且注释必须**紧邻**所说明的对象。原文："All interfaces, categories, and protocols ... MUST be commented. Comments must also be adjacent to the object they're documenting."
- 注释用于：类、属性、实例变量、函数、category、protocol 声明、枚举
- 每个方法应有注释说明：功能、参数、返回值、线程/队列假设、副作用
- 公共方法文档放**头文件**；非平凡私有方法注释紧邻方法之前
- 豁免：测试类/测试方法名已足够时不需注释；测试工具方法（helper）必须注释

## C. 可套用模板

方法声明注释（描述性语态 + 关键信息）：
```objc
// Opens |file| and returns its contents, or nil if the file cannot be read.
- (NSString *)contentsOfFile:(NSString *)file;
```

哨兵值注释：
```objc
- (NSString *)name;  // nil if the record has no name
```

所有权注释（MRC，非 Objective-C 对象指针必须）：
```objc
NSString * _name;        // strong: retained
CFStringRef _cfName;     // weak: not retained
```

## D. TODO 格式

- 本指南**无 TODO 格式规则**（全文无 TODO 字样）

## E. 语言特有规则

- **描述性语态**。原文："Use descriptive form (\"Opens the file\") rather than imperative form (\"Open the file\") for method and function comments."
- 声明注释写"如何使用"；实现说明放实现处。原文："Declaration comments explain how a method or function is used. Comments explaining how a method or function is implemented should be with the implementation"
- 方法名应读如散文（本身降低注释需求）
- 重大修改带作者行的文件时考虑删除作者行（版本历史更准确）
- designated initializer 属性不可用时用注释声明指定初始化器
- **对象所有权（MRC）**：NSObject 派生的实例变量默认视为 retain；未 retain 的须注释为 weak 或用 `__weak`；指向 Core Foundation/C++ 等非 OC 对象的实例变量**必须**用 strong/weak 注释标明是否持有。ARC 下无需额外注释。原文："Object ownership and lifetime are explicit when using ARC, so no additional comments are required for automatically retained objects."
- switch 故意 fall-through 必须注释（`// Falls through.`），除非 case 间无代码
- 命名与注释中使用包容性语言（避免 master/slave、blacklist/whitelist 等）

## F. 反例

```objc
// Open the file           // BAD: 祈使语态
// BAD: 注释远离所说明的声明

// BAD: 方法名已读如散文仍写大量逐行实现注释
```

## G. 审查清单

- [ ] 所有非平凡接口/category/protocol（含私有）有注释且紧邻声明？
- [ ] 方法注释含功能/参数/返回值/线程假设/副作用？
- [ ] 公共方法文档在头文件？私有方法注释紧邻方法？
- [ ] 描述性语态（Opens 而非 Open）？
- [ ] 行尾注释隔 ≥2 空格？
- [ ] 哨兵值（nil/-1）含义已注释？
- [ ] MRC 下非 retain/Core Foundation 对象的所有权注释齐全（或已用 `__weak`）？
- [ ] fall-through 有注释？NOLINT 格式正确（单空格）？
- [ ] 注释语言包容（无 master/slave 等）？

## H. 易误引的"不存在"规则

- **无** TODO 格式规则
- **无** JS/TS 式"JSDoc/实现注释二分"强制；Doxygen 仅为"鼓励且项目内一致"
