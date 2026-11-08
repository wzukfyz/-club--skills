# C++ 注释规范速查（Google C++ Style Guide 提炼）

> 来源: https://google.github.io/styleguide/cppguide.html 顶层 Comments 章（Comment Style / File Comments / Struct and Class Comments / Function Comments / Variable Comments / Implementation Comments / Punctuation, Spelling, and Grammar / TODO Comments）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- `//` 或 `/* */` 均可，保持一致即可。原文："Use either the `//` or `/* */` syntax, as long as you are consistent."（`//` 更常见）
- 本指南**无** Java 式多行 `*` 对齐强制、无星号方框禁令
- 标点/拼写/语法：注释像叙述文本，正确大小写与标点；完整句优于片段；行尾短注释可较不正式但须风格一致。原文："Pay attention to punctuation, spelling, and grammar; it is easier to read well-written comments than badly written ones."

## B. 必须写注释的位置 + 豁免

- **文件**：每个文件开头放 license boilerplate；声明多个用户可见抽象的源文件加整体描述注释（单个抽象的详细文档放各自抽象处）；新文件通常不含版权声明或作者行
- **类/结构**："Every non-obvious class or struct declaration should have an accompanying comment that describes what it is for and how it should be used."；同步/多线程假设必须记录；类注释适合放一小段聚焦用法示例
- **函数声明**："Almost every function declaration should have comments immediately preceding it that describe what the function does and how to use it."；豁免仅限简单且显而易见（如明显属性的简单 accessor）；**`.cc` 中的私有方法和函数不豁免**
- **函数定义**：实现有棘手之处时必须有解释性注释
- **类数据成员**：类型与名字未表达的 invariant（特殊值、成员间关系、生命周期要求）必须注释；哨兵值（`nullptr`、`-1`）的含义必须注释
- **全局变量**："All global variables should have a comment describing what they are, what they are used for, and (if unclear) why they need to be global."
- **实现代码**：在棘手、不明显、有趣或重要的部分写注释；棘手代码块前必须有注释

**豁免**：构造/析构平凡时可不注释（析构无头注释很常见）；override 多数情况无需注释（除非 override 本身有特殊之处）

## C. 可套用模板

类注释（含用法示例）：
```cpp
// Iterates over the contents of a GargantuanTable.
// Example:
//    std::unique_ptr<GargantuanTableIterator> iter = table->NewIterator();
//    for (iter->Seek("first"); !iter->done(); iter->Next()) {
//      process(iter->key(), iter->value());
//    }
class GargantuanTableIterator { ... };
```

函数声明注释（隐含主语 "This function"，动词短语开头）：
```cpp
// Returns true if the table contains the given key `key`.
// `keys` must not be null. The result is valid until the next call to
// Rebuild(). Thread-safe.
bool ContainsKey(const std::string& key);
```

函数定义注释（重点写 how，不重复 .h）：
```cpp
// Uses a two-pointer sweep instead of sorting to keep this O(n).
bool ContainsKey(const std::string& key) { ... }
```

调用点参数注释（最后手段）：
```cpp
CalculateProduct(values, options, /*completion_callback=*/nullptr);
```

## D. TODO 格式

- 全大写 `TODO` + 标识符（bug ID、人名、邮箱、设计文档链接）。原文："`TODO`s should include the string `TODO` in all caps, followed by the bug ID, name, e-mail address, or other identifier of the person or issue with the best context"
- 示例：
  - `// TODO(bug 12345): remove the "Last visitors" feature.`
  - `// TODO(example.com/my-design-doc): Manually fix up this code the next time it's touched.`
  - `// TODO(zeke): change this to use relations.`
- TODO 不是被点名者的修复承诺；用名字时几乎总是写自己的名字
- 未来型 TODO 必须给具体日期（"Fix by November 2005"）或具体事件（"Remove this code when all clients can handle XML responses."）

## E. 语言特有规则

- **声明 vs 定义分工**：原文 "Declaration comments describe use of the function (when it is non-obvious); comments at the definition of a function describe operation."（.h 写用法，.cc 写实现；定义注释可简要复述但不重复声明注释）
- 函数注释隐含主语 "This function"，动词短语开头："Opens the file"，而非 "Open the file"
- 函数声明注释应写明：输入输出（参数名可用反引号便于索引工具）、成员函数是否保存引用/指针参数、指针参数可否为空、输出参数覆盖还是追加、性能影响
- 不要冗长或陈述完全显而易见之事。原文："do not be unnecessarily verbose or state the completely obvious."
- override 注释聚焦 override 本身的特殊性，不重复被覆盖函数的注释
- 实参含义不明显时的补救优先级：命名常量 > bool 改 enum > 选项 struct > 命名变量 > 注释（最后手段）
- 接口与实现分离时：用法注释随接口定义，实现注释随方法实现
- 自描述代码不需要注释（如 `if (!IsAlreadyProcessed(element))`）

## F. 反例

- 逐字描述代码。原文："Do not state the obvious... don't literally describe what code does, unless the behavior is nonobvious to a reader who understands C++ well. Instead, provide higher-level comments that describe *why*"
- `// Open the file`（祈使句，应写 "Opens the file"）
- 在 .cc 定义处重复 .h 的声明注释

## G. 审查清单

- [ ] 每个文件开头有 license boilerplate？
- [ ] 非显然类/结构有用途与用法注释？多线程假设已记录？
- [ ] 几乎每个函数声明前有注释（含 .cc 私有方法）？
- [ ] 函数注释动词短语开头（Opens 而非 Open）？
- [ ] 声明注释写用法、定义注释写实现，无重复？
- [ ] 哨兵值/invariant/全局变量已注释？
- [ ] 注释无逐字复述代码？
- [ ] TODO 全大写 + 标识符？未来型有具体日期/事件？
- [ ] 标点/大小写/语法规范且文件内一致？

## H. 易误引的"不存在"规则

- **无** Deprecation Comments 子节；`DEPRECATED(name)` 格式**不存在**（旧版指南内容，现行版已删）
- **无** TODO 链接式格式（`TODO: crbug.com/... - ...` 是 Java/Python 格式）
- **无** 多行注释 `*` 对齐要求、无星号方框禁令（这些在 Java/JS/TS）
