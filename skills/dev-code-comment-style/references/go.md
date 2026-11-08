# Go 注释规范速查（Google Go Style Documents 提炼）

> 来源: https://google.github.io/styleguide/go/decisions（Commentary 章及其子节）、go/best-practices（Documentation 章）、go/guide（原则散句）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- 注释语法用 `//`（Go 惯例，gofmt 保证）；`/* */` 块注释可用于包注释等场景
- **无固定行宽**。原文："There is no fixed line length for comments in Go." 长行应折行；80/100 列是常见选择但非硬界限；目标是**文件内一致**
- 禁止把大段文字塞进单行（阅读体验差）
- Godoc 几乎不用特殊格式；列表/代码片段用缩进呈现；除缩进外避免装饰。原文："Apart from indentation, decoration should generally be avoided."

## B. 必须写 doc comment 的位置 + 豁免

- **强制**。原文："All top-level exported names must have doc comments, as should unexported type or function declarations with unobvious behavior or meaning."
- doc comment 服务于公共 API 文档读者（Godoc/IDE 中展示），"should be written for anyone using the package."
- 未导出代码的 doc comment 也以（未导出）名字开头（便于日后导出时替换）

## C. 可套用模板

导出类型/函数（以对象名开头的完整句）：
```go
// A Request represents a request to run a command.
type Request struct { ... }

// Encode writes the JSON encoding of req to w.
func Encode(w io.Writer, req *Request) { ... }
```

包注释（紧贴 package 子句、无空行）：
```go
// Package math provides basic constants and mathematical functions.
package math
```

`main` 包（用二进制名，首词大写）：
```go
// The seed_generator command is a utility that ...
package main
```

行尾短语注释（struct 字段可用，假定字段名为隐含主语）：
```go
WelcomeMessage string // displayed when user logs in
```

## D. TODO 格式

- Go 风格文档**无 TODO 格式规定**

## E. 语言特有规则

- **doc comment 以被描述对象名开头**。原文："full sentences that begin with the name of the object being described." 可加冠词 a/an/the 使读来自然
- **句子规范**：完整句注释按标准英文大写 + 标点；片段式注释无大小写/标点要求；**文档注释必须是完整句**；行尾注释可为短语
- **包注释**：必须在 package 子句正上方且无空行。原文："Package comments must appear immediately above the package clause with no blank line"；每包恰好一条（多文件包只在一个文件写）；无主文件或注释极长时可放 `doc.go`；面向维护者的文件级注释放 import 之后（不出现在 Godoc、不受包注释规则约束）
- **Godoc 格式**：空行分段（"A blank line is required to separate paragraphs"）；额外缩进两空格 = 逐字呈现（可实现列表/表格/代码）；单行大写开头 + 仅含括号逗号标点 + 后跟段落 → 自动成标题
- 忽略错误必须注释解释为何安全：`n, _ := b.Write(p) // never returns a non-nil error`
- 避免在函数实参上写行内注释（改用 option struct 或在函数文档中说明）："Avoid adding inline comments to specific function arguments where possible."
- 空 case 用注释而非 `break` 澄清意图
- 可运行示例放测试文件（Example 函数），不放生产代码；无法提供时可在注释中给示例代码
- **Signal boosting**：形似常见写法但语义不同的代码加注释提升注意（`if err == nil { // if NO error`）
- 文档原则：只记录易错/非显然的参数与字段并说明 why；不重述惯例行为（如 context 取消）；仅当非默认时记录并发安全；记录清理义务（`// Caller should close resp.Body when done reading from it.`）、显著错误值/错误类型；全包约定写入包文档
- 命名返回值会影响 Godoc 签名；同类型多个返回值或调用方须对结果采取动作时命名有用；不用命名返回值规避函数内变量声明，不借其使用裸返回
- Best practice：开发与评审时用 pkgsite/doc preview 预览文档渲染

## F. 反例

```go
// encodes req to w        // BAD: 文档注释是片段（无大写无标点）
// This function encodes.. // BAD: 未以对象名开头
// format is the format, and data is the interpolation data.  // BAD: 重述显而易见参数
bad := server.New(ctx, 42, // Port  // BAD: 实参行内注释
// func (n *Node) Parent1() (node *Node)  // BAD: 命名造成重复
```

## G. 审查清单

- [ ] 所有顶层导出名有 doc comment？
- [ ] doc comment 以对象名开头（可加冠词）且是完整句（大写 + 标点）？
- [ ] 包注释紧贴 package、每包一条？
- [ ] 注释行宽合理（已折行、文件内一致、无超长单行）？
- [ ] 忽略错误处有安全性注释？
- [ ] 无实参行内注释？
- [ ] 文档未重述惯例行为（context 取消等）？
- [ ] 清理义务/并发安全/显著错误值已记录（若非默认）？
- [ ] 复杂代码有 why 注释、无复述 what 的冗余注释？

## H. 易误引的"不存在"规则

- best-practices 文档**无** Commentary 章（注释规则在 decisions；best-practices 对应章节为 Documentation）
- **无** "行注释优先于块注释"的一般性规定（块注释可用于包注释场景）
- **无** TODO 格式规定
