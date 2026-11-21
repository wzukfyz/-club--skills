# Markdown 文档写作规范（Google Markdown Style Guide 提炼）

> 来源: https://google.github.io/styleguide/docguide/style.html（源码 `google/styleguide` 仓库
> `gh-pages/docguide/style.md`）| 核对日期 2026-11-21 | 关键规则附英文原文
>
> **来源性质**：本指南属 **docguide 子站**，与主站 `styleguide/*guide.md`（Python/Java/C++ 等）
> 不是同一套文档。它讲「整篇文档怎么组织」，**不涉及代码注释语法**；注释请用 code-comment-style。
>
> **适用范围**：面向英文与中文文档。Google 原文未对 CJK 作任何规定，中文落地细则集中在 F 节，
> 该节每条都显式标注「非 Google 规则」，引用时不得混为一谈。

## A. 语法与格式

- **行宽 80 字符**。原文："Markdown content follows the residual convention of an 80-character
  line limit. Why? Because it's what most of us do for code."
  - 四条例外（原文 "Exceptions to the 80-character rule include"）：**Links / Tables / Headings /
    Code blocks**
  - 链接行可超 80，但原文限定 "text before and after the link gets wrapped"——链接前后的正文仍要折行
  - 计量单位：原文只说 `80-character`，未定义 CJK 如何计数。本 skill 统一按 **Unicode code point**
    计（1 个汉字 = 1 字符），见 F 节
- **禁止行尾空白**，硬换行改用行尾反斜杠。原文："Don't use trailing whitespace. Use a trailing
  backslash to break lines."
  - 理由：CommonMark 规定行尾两个空格插入 `<br />`，但多数仓库有提交前检查、多数 IDE 会自动清理
  - 反斜杠也要克制用。原文："Best practice is to avoid the need for a `<br />` altogether. A pair
    of newlines will create a paragraph tag; get used to that."
- **标题只用 ATX（`#`）**，禁用 `===` / `---` 下划线式。原文："Headings with `=` or `-` underlines
  can be annoying to maintain and don't fit with the rest of the heading syntax. An editor has to
  ask: Does `---` mean H1 or H2?"
- **`#` 后必须有空格，标题前后必须有空行**。原文："Prefer spacing after `#` and newlines before and
  after"；"Lack of spacing makes it a little harder to read in source."
- **标题名唯一且完整**，即使是子节。原文："Use unique and fully descriptive names for each heading,
  even for sub-sections. Since link anchors are constructed from headings, this helps ensure that the
  automatically-constructed anchor links are intuitive and clear."
  - 反例：两个 `## Foo` / `## Bar` 下各有 `### Summary`；正例：`### Foo summary` / `### Bar summary`
- **有序列表用真实编号**。原文："Use fully numbered lists, because it's nicer to read in source."
  - 懒人编号（连续 `1.`）**已废弃**。原文："Historically, we recommended lazy numbering to reduce the
    burden of keeping numbers up to date. This is no longer applicable now that the auto-formatter can
    keep the real numbers up to date."
- **嵌套列表统一 4 空格缩进**（编号列表与项目符号列表同标准）。原文："When nesting lists, use a
  4-space indent for both numbered and bulleted lists"
  - 编号后 2 空格、项目符号后 3 空格，使正文本身落在第 4 列
  - 嵌套层的包裹文本需 8 空格。原文："Wrapped text in a nested list needs an 8-space indent."
- **代码块一律用围栏（fenced），并声明语言**。原文："For code quotations longer than a single line,
  use a fenced code block."；"It is best practice to explicitly declare the language, so that neither
  the syntax highlighter nor the text editor must guess."
  - 禁用四空格缩进式代码块。原文："Four-space indenting is also interpreted as a code block. However,
    we strongly recommend fencing for all code blocks."
  - 若代码块内需出现三反引号，用波浪线围栏包裹。原文："enclose the backticked code block in
    CommonMark tildes"
- **行内代码兼作转义**。原文："When you don't want text to be processed as normal Markdown, like a
  fake path or example URL that would lead to a bad autolink, wrap it in backticks"
  - 泛指文件类型时也用行内代码，而非指某个具体文件。原文："Use inline code when referring to file
    types in a generic sense, rather than a specific existing file."
- **产品名、工具名、二进制名保留原始大小写**。原文："Use the original names of products, tools and
  binaries, preserving the capitalization."
- **优先标准 Markdown，避免 HTML hack**。原文："Please prefer standard Markdown syntax wherever
  possible and avoid HTML hacks. ... Except for big tables, Markdown meets almost all needs already."

## B. 必须遵守的位置与结构

- **全文只用一个 H1**，作为文档标题，且与文件名相同或近似。原文："The first heading should be a
  level-one heading, ideally the same or nearly the same as the filename."；"Use one H1 heading as
  the title of your document. Subsequent headings should be H2 or deeper. Some themes hide any H1
  headings after the first."
- **H1 之后紧跟 1–3 句简介**，写给完全不懂该主题的读者。原文："1–3 sentences providing a high-level
  overview of the topic. Imagine yourself as a complete newbie who landed on your 'Extending Foo'
  doc and doesn't know the most basic information you take for granted."
- **TOC 放在简介之后、首个 H2 之前**。原文："Place the `[TOC]` directive after your page's
  introduction and before the first H2 heading."；"'[TOC]' placement matters a lot when screen readers
  or keyboard controls are involved."——放在文末会导致读屏软件要读到结尾才发现目录
- **其余标题从 H2 起**。原文："The rest of your headings should start from level 2."
- **文末放 `## See also`** 收尾。原文："Put miscellaneous links at the bottom for the user who wants to
  know more or didn't find what they needed."
- **每个标题都要显式锚点**。原文："People will create deep links to specific points in your doc,
  even if you don't do that yourself. To prevent changes you make to your doc from breaking external
  links, you should always use explicit targets for headings in your doc."
  - 即标题隐含 id 与文案一致，也要显式写，否则改标题文案会断掉外部深链
  - 标题过长或含标点时，锚点还能让 URL 更易读
- **图片必须配替代文本**。原文："Make sure to provide appropriate text to describe your image.
  Readers who are not sighted cannot see your image and still need to understand the content!"

## C. 可套用模板

最小合规骨架（把 `my-doc`、标题、简介替换为实际内容）：

````markdown
# Document title

1–3 句简介：这是什么、解决什么问题、读者需要什么前置知识。

[TOC]

<a id="background"></a>

## Background

正文。

<a id="usage"></a>

## Usage

正文。

## See also

- [Related doc](https://example.com/related)
````

要点：

- H1 与文件名对齐（`my-doc.md` 对应 `# My doc` 亦可接受，原文只要求 "same or nearly the same"）
- `author` 为可选行，原文："If you'd like to claim ownership of the document or if you are very
  proud of it, add yourself under the title. However, revision history generally suffices."
- 锚点放在标题**上一行**，id 用短横线小写，语义稳定，不随标题文案改写

## D. TODO 格式

**本指南无 TODO 规定**。原文通篇未出现 TODO 的格式要求、所有者标注或"未来某日"约束。

处置建议（**非 Google 规则**，属本 skill 补充）：

- 项目若无既有约定，可用 HTML 注释：`<!-- TODO: 说明（负责人/日期） -->`，渲染后不可见
- 需注意这与 A 节 "avoid HTML hacks" 存在张力；Gitiles 等不渲染 HTML 的宿主会把它当正文
- 不要在 Markdown 正文里用 `TODO(name):` 这类从 C++/Java 注释规范搬来的格式——那是注释语法，
  不属于文档规范

## E. Markdown 特有细则

### E1 链接

- **能缩短就缩短**。原文："Long links make source Markdown difficult to read and break the 80
  character wrapping. Wherever possible, shorten your links."
- **跨目录禁用 `../` 相对路径**。原文："Relative paths are fairly safe within the same directory."
  / "Avoid relative links if you need to specify other directories with `../`"
  - 同目录：`other-page-in-same-dir.md`；跨目录：`/path/to/another/dir/other-page.md`
- **链接文字必须有信息量**。原文："Users often do not read documents; they scan them. ... titling
  your links 'here,' 'link,' or simply duplicating the target URL tells the hasty reader precisely
  nothing and is a waste of space."
  - 做法：先把句子写自然，再回头把最合适的短语包成链接
- **删掉搜索串里的冗余参数**。原文："Most links generated by search queries include many parameters
  that aren't necessary to get the user to the right place"

### E2 引用式链接（reference links）

- 仅在三种场景使用：**链接很长**、**同一目标重复引用**、**表格单元格内**
- 判据（原文）："Use reference links where the length of the link would detract from the readability
  of the surrounding text if it were inlined. Reference links make it harder to see the destination
  of a link in source text, and add additional syntax."
  - 短链接不要用引用式，直接内联。原文举例：`https://example.com/style says ...` 比
    `The [style guide][style_guide] says ...` + 定义更清楚
- **表格内优先用引用式**。原文："Use reference links more often in tables. It is particularly
  important to keep table content short, since Markdown does not provide a facility to break text in
  cell tables across multiple lines"
- **定义放在首次使用所在节的末尾**（即下一个标题之前）。原文："We recommend putting reference link
  definitions just before the next heading, at the end of the section in which they're first used."
  - 例外：跨多个小节使用的定义放文档末尾，避免小节移动后出现悬空链接

### E3 表格

- **只在数据本身适合表格时用**：二维分布相对均匀、多个平行条目各有属性
- **能改列表就改列表**。原文："Avoid using tables when your data could easily be presented in a
  list. Lists are much easier to write and read in Markdown."
- 原文点名的三种病态表格：
  - **Poor distribution**：多列在各行无差异，且有空格子——说明数据不需要表格
  - **Unbalanced dimensions**：列多行少（或反之），表格退化成"不灵活的文本框"
  - **Rambling prose**：单元格里写长段落；"Tables should tell a succinct story at a glance."
- 表格可超 80 字符，但仍应尽量紧凑；单元格内链接用引用式

### E4 图片与 iframe

- **少用图片，优先简单截图**。原文："Use images sparingly, and prefer simple screenshots."
  - 用图判据：原文 "Use images when it's easier to show a reader something than to describe it."
- **`<iframe>` 禁止自闭合**。原文："Even though it may seem that the `<iframe>` element is
  self-closing ... it actually is not ... trying to use self-closed iframe may lead to unexpected
  consumption of content."
  - 写成 `<iframe src="..."></iframe>`，否则后续内容会被吞进 iframe

### E5 代码块的两个特殊场景

- **命令行片段用反斜杠转义换行**，便于整段复制粘贴。原文："Because most command-line snippets are
  intended to be copied and pasted directly into a terminal, it's best practice to escape any
  newlines. Use a single backslash at the end of the line"
- **列表内嵌代码块**需相对列表缩进再缩进 4 空格，否则列表会被打断。原文："If you need a code block
  within a list, make sure to indent it so as not to break the list"

### E6 渲染器依赖清单（写之前先确认宿主）

| 写法 | 来源 | 在哪些宿主成立 | 替代方案 |
|---|---|---|---|
| `[TOC]` | Gitiles 指令 | 仅 Gitiles | GitHub/GitLab 用渲染器生成的目录，或手写锚点链接列表 |
| `* TOC` + `{:toc}` | kramdown（Jekyll） | google.github.io 自身在用 | 同上；不要与 `[TOC]` 混用 |
| `<a id="x"></a>` | 内联 HTML | 允许 raw HTML 的宿主（GitHub、Gitiles、多数文档站） | 纯 CommonMark 渲染器无法保证 |
| `[^note]` 脚注 | 非 CommonMark 标准 | GFM、kramdown 支持 | 宿主不支持时改为括注或 `## Notes` 小节 |

> 事实依据：Google 原文文首用的是 `* TOC` + `{:toc}`（kramdown 语法），而 TOC 章节推荐 `[TOC]`
> （Gitiles 语法）——同一份指南在不同宿主上写法不同，正说明这类指令不可跨渲染器照搬。

## F. 中文场景适配（**非 Google 规定**）

Google 原文面向英文单字节语境，行宽、大小写、标点规则在中文下全部需要重新落地。以下六条为本
skill 补充，引用时**必须**标注「非 Google 规则」。

**F1 行宽按 code point 计**：1 个汉字 = 1 字符，上限 80。按此计，80 字约为 2–4 句，限制相当宽裕。
不要按显示列数（1 汉字 = 2 列）折算，否则中文段落会被切成 40 字的碎片。

**F2 折行点优先落在句末标点后**：`。！？；` 优先，其次 `，、`；禁止在词语中间断开。原因是中文硬折行
在渲染时会产生一个伪空格，断在句中会让读者看到"词 语"这类异常间隙。

**F3 一句一行是推荐写法**：多句段落可让每句独立成行。它受 F1 约束（单句超 80 字仍需在逗号处折行），
因此不需要单列为规则，也不会与 80 字符上限冲突。好处是 diff 精确到句、评审时改动范围清晰。

**F4 中英文之间加空格**：如「使用 `git commit` 提交」。这属中文技术写作惯例，Google 未规定；
代码、字段名、命令保持半角原样。

**F5 中文正文用全角标点**：`，。！？：；（）`；英文句子、代码、URL 内保持半角。中英混排时不要
同一句内混用两种句号。

**F6 大小写规则对中文不适用**：A 节的 Capitalization 只约束拉丁字母写的产品名。中英混排时，
产品名仍保留原始大小写（`iPhone` 不写成 `IPhone`），中文部分不涉及大小写。

## 附录：反例对照

| 违规写法 | 问题 | 修正 |
|---|---|---|
| 连续 `1.` / `1.` / `1.` | 懒人编号已废弃 | 改成 `1.` `2.` `3.` |
| `Heading` + `--------` | setext 标题难维护、层级歧义 | `## Heading` |
| `##Heading`（无空格） | 源码可读性差 | `## Heading` |
| 两个 `### Summary` | 自动锚点重复，链接指向不明 | `### Foo summary` / `### Bar summary` |
| 四空格缩进代码块 | 无法声明语言、边界模糊、难搜索 | 三反引号围栏 + 语言标识 |
| 行尾两个空格硬换行 | 会被 IDE/pre-commit 清掉 | 行尾 `\` 或改用空行分段 |
| `[here](url)` / 裸 URL 当链接文字 | 扫读者得不到任何信息 | 把最有信息量的短语包成链接 |
| 列多行少、格内写长段的表格 | 表格退化成文本框 | 改用 `##` 小节 + 列表 |
| `<iframe src="..." />` | 后续内容被吞进 iframe | `<iframe src="..."></iframe>` |
