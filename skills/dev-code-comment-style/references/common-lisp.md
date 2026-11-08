# Common Lisp 注释规范速查（Google Common Lisp Style Guide 提炼）

> 来源: https://google.github.io/styleguide/lispguide.md（Comment semicolons / File Header / Non-Obvious Code / Docstrings / Punctuation, Spelling and Grammar）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式（分号层级，核心规则）

| 分号数 | 用途 |
|---|---|
| `;;;;` | 文件头/文件级描述 |
| `;;;` | 顶层形式（top-level form）注释 |
| `;;` | 顶层形式内部（代码段）注释 |
| `;` | 行尾注释 |

- 分号与注释文本之间加空格。原文："Include a space between the semicolons and text of the comment."
- 行尾注释与代码用空格分隔；连续相关的行尾注释尽量垂直对齐
- 标点/拼写/语法与 C++/Python 同源：完整句、大写、正确标点；行尾注释可较不正式但风格一致

## B. 必须写注释/文档的位置

- **docstring**：语言允许处一律使用；所有顶层函数、类型、类、变量、宏都必须有 docstring。原文："Use docstrings for all top-level functions, types, classes, variables, and macros."
- **文件头**：以 `;;;;` 简述文件内容；**不写作者信息**，一般不写版权（独立分发文件除外）
- **正则表达式必须加注释**（通常上一行 `;;`）。原文："you MUST ALWAYS put in a comment ... explaining, at least basically, what the regular expression does, or what the purpose of using it is."
- bug 修复代码加注释说明原因（推荐附 bug 号）

## C. 可套用模板

```lisp
;;;; Variable length encoding for integers and floating point numbers.

;;; File-level comments or comments for large sections of code.

(defun frob (n)
  ;; Comment that applies to a section of code.
  (let ((x (= n 2)))   ; parenthetical remark here
    x))
```

docstring（符号名大写）：
```lisp
(defun frob (n)
  "Frobs the value of N. The value of N must be an integer.
Returns the frobbed value."
  ...)
```

## D. TODO 格式

- `;; TODO(标识): 说明`，理想情况引用 bug 号。原文："Ideally a TODO comment should reference a bug number"
- 示例：`;; TODO(b/1234567): use circular lists for fizzbuzz`；`;; TODO(zippy@foo.com): Refactor to provide a better API.`
- 日期用 YYYY-MM-DD：`;;--- TODO(brown): Remove this code after release 1.7 or before 2012-11-30.`
- TODO 注释应说明问题类型、性质与处理提示

## E. 语言特有规则

- docstring 写"如何使用"（参数、返回值、副作用），不写"代码如何工作"。原文："Document how to use a function, including its parameters, return values, and side effects, not how the code works."
- docstring 中 Lisp 符号名用大写（如 "The value of LENGTH must be an integer."）；长 docstring 以一句话摘要开头
- 宏：明确记录非卫生（unhygienic）方面与副作用；宏定义宏要格外清晰地文档化
- 函数内用空行分段时，用 `;;` 说明每段用途
- `eval-when` 关闭括号后加 `; eval-when` 注释

## F. 反例

- 文件头写作者信息。原文："You should not include authorship information at the top of a file"
- 正则表达式无注释

## G. 审查清单

- [ ] 分号层级使用正确（`;;;;`/`;;;`/`;;`/`;`）？
- [ ] 分号后有空格？行尾注释对齐？
- [ ] 所有顶层函数/类型/类/变量/宏有 docstring？
- [ ] docstring 大写符号名、写用法而非实现？
- [ ] 文件头为 `;;;;` 且无作者信息？
- [ ] 正则表达式有注释？
- [ ] TODO 为 `;; TODO(标识): ...` 格式？

## H. 易误引的"不存在"规则

- **无** 独立 "Comments" 一级章（规则分布在 Formatting/Documentation 各节）
