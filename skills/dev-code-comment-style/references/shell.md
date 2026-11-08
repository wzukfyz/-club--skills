# Shell 注释规范速查（Google Shell Style Guide 提炼）

> 来源: https://google.github.io/styleguide/shellguide.html §Comments（File Header / Function Comments / Implementation Comments / TODO Comments）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- 注释以 `#` 开头；文件头注释位于 shebang 之后
- 复杂管道的注释放在**整个管道之前**；若注释与管道都很大，考虑抽成 helper 函数

## B. 必须写注释的位置

- **文件**："Every file must have a top-level comment including a brief overview of its contents."（版权与作者信息可选）
- **函数**："Any function that is not both obvious and short must have a function header comment. Any function in a library must have a function header comment regardless of length or complexity."
- 目标：仅凭注释（与自帮助）即可学会使用程序或库函数，无需读代码

## C. 可套用模板

文件头：
```bash
#!/bin/bash
#
# Perform hot backups of Oracle databases.
```

函数头（官方分隔线式，字段按需）：
```bash
#######################################
# Cleanup files from the backup directory.
# Globals:
#   BACKUP_DIR
#   ORACLE_SID
# Arguments:
#   None
#######################################
function cleanup() {
  ...
}
```

含 Outputs 的函数：
```bash
#######################################
# Print out the directory name.
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   Writes the directory name to stdout
# Returns:
#   None
#######################################
```

字段清单：Description（描述）/ Globals（使用与修改的全局变量）/ Arguments（参数）/ Outputs（写到 STDOUT 或 STDERR）/ Returns（非最后命令默认退出状态的返回值，如 `0 if thing was deleted, non-zero on error.`）

## D. TODO 格式

- 全大写 `TODO` + 最了解该问题者的名字/邮箱/标识。原文："followed by the name, e-mail address, or other identifier of the person with the best context about the problem referenced"
- 示例：`# TODO(mrmonkey): Handle the unlikely edge cases (bug ####)`
- 几乎总是写自己的名字（TODO 不是修复承诺）

## E. 语言特有规则

- 实现注释："Comment tricky, non-obvious, interesting or important parts of your code."；"Don't comment everything"——复杂算法或超常规操作才加短注释
- 文件最后一行非注释代码应是 `main "$@"`

## F. 反例

- 什么都注释（"Don't comment everything"）
- 库函数无函数头注释（无论多短）
- 管道注释写在管道中间而非之前

## G. 审查清单

- [ ] 文件有顶层内容概述注释？
- [ ] 非显而易见/非短函数都有函数头注释？库函数全有？
- [ ] 函数头含 Description/Globals/Arguments/Outputs/Returns 必要字段？
- [ ] 棘手/超常规代码有短注释、无过度注释？
- [ ] 复杂管道注释位于管道整体之前？
- [ ] TODO 格式为 `TODO(标识): ...`？

## H. 易误引的"不存在"规则

- **无** TODO 链接式要求（`TODO: 链接 - 说明` 是 Java/Python 格式）
- 无其他特有禁令
