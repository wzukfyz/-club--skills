# Haskell 注释规范速查（Google Haskell Style Guide 提炼）

> 来源: https://google.github.io/styleguide/haskellguide.md（Structure→Haddock、Style→Comments、Formatting→Comments）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- 注释统一用 `--`（pragma 与行中注释除外）。原文："Use `--` for all comments except pragmas, or where the comment must be in the middle of a line."
- 行尾注释：`--` 前至少 2 空格、后至少 1 空格
- 行尾注释用于数据类型定义时应垂直对齐
- pragma 用 `{-# ... #-}`（`OPTIONS_GHC`/`LANGUAGE` 置文件顶部；`INLINE` 等紧随所修饰声明）

## B. 必须写注释的位置 + 豁免

- **Haddock**："The module and all exported top-level elements should have Haddock."
- Haddock 紧邻所文档元素之前；无需重复参数名/类型（声明已可见）。原文："It need not repeat argument names or types, as they are readily apparent from the declaration."
- 豁免："Extremely simple type synonyms or other very obvious declarations need not have any Haddock."

## C. 可套用模板

```haskell
-- | The module or function summary sentence.
--
-- Longer description.
foo :: Int -> Int

-- record 字段行尾注释（-- ^）
data Config = Config
  { ciName :: T.Text  -- ^ name and short summary on one line
  , ciAge  :: Int     -- ^ age in years
  }
```

## D. TODO 格式

- 本指南**无 TODO 格式规定**

## E. 语言特有规则

- Haddock 写完整句、首字母大写、正确标点。原文："Write proper sentences; start with a capital letter and use proper punctuation."
- 顶层注释目的：说明**用途**而非实现。原文："The aim is to explain the purpose of the function, not the implementation."
- 代码内注释解释非显而易见的原因/棘手之处。原文："comments in the code should be used to explain any non-obvious reasoning for why something was done a particular way, or is particularly tricky."
- 行内链接（如模块/函数引用）节制使用：仅当用户可能想点击、且只对每个 API 名的首次出现加链接

## F. 反例

- 顶层导出元素无 Haddock（除非极简单的类型同义词等）
- 顶层注释解释实现细节而非用途

## G. 审查清单

- [ ] 模块与所有导出顶层元素有 Haddock？
- [ ] Haddock 紧邻声明、完整句、大写开头？
- [ ] `--` 注释间距规范（前 ≥2、后 ≥1）？
- [ ] 行尾注释在数据类型定义处对齐？
- [ ] 棘手代码有 why 注释？

## H. 易误引的"不存在"规则

- **无** TODO 格式；**无** 注释行宽规定
