# Python 注释规范速查（Google Python Style Guide 提炼）

> 来源: https://google.github.io/styleguide/pyguide.html §3.8（Comments and Docstrings）、§3.12（TODO Comments）| 调研日期 2026-10-12 | 关键句附英文原文

## A. 语法与格式

- docstring 一律用三双引号：`"""..."""`（PEP 257）。原文："Always use the three-double-quote `\"\"\"` format for docstrings (per PEP 257)."
- docstring 摘要行：一条物理行、≤80 字符，以句号/问号/感叹号结尾；如有更多内容，摘要行后必须跟空行，其余内容与首行引号位置对齐
- 块注释/行内注释以 `#` 开头；行尾注释与代码至少间隔 2 空格，`#` 后至少 1 个空格。原文："these comments should start at least 2 spaces away from the code with the comment character `#`, followed by at least one space before the text of the comment itself."
- 80 列限制豁免：注释中的长 URL/路径/长 flag（长 URL 独占一行）、pylint disable 注释（如 `# pylint: disable=invalid-name`）
- 不要用空格垂直对齐连续行的 token（含 `#`）
- `# type: ignore`、`# pytype: disable=...` 可作类型检查抑制注释；**不要**再新增行尾 `# type: <type>` 注释（Python 3.6 前旧物）

## B. 必须写 docstring 的位置 + 豁免

**强制**（原文："A docstring is mandatory for every function that has one or more of the following properties"）：
- 公共 API 的一部分
- 规模不小（nontrivial size）
- 逻辑不直观（non-obvious logic）

其他要求：
- **模块**：文件以描述内容及用法的 docstring 开头；每个文件含 license boilerplate
- **类**：类定义下应有 docstring；公共属性（property 除外）记入 `Attributes:` 小节；类 docstring 以"类实例代表什么"的一行摘要开头，不得重复"这是一个类"之类信息
- **被装饰的函数/类**：docstring 必须描述装饰器应用**之后**的行为，因为那是调用者观察到的行为

**豁免**：
- 测试模块无需模块级 docstring；`unittest.TestCase` 子类及 `test_` 方法不要求；仅重复类/方法名的 docstring 应省略
- `@override` 装饰的方法不需要 docstring（除非实质性细化基类契约或需说明额外副作用，此时必须写差异）
- 仅返回 None 时无需 `Returns:` 小节；docstring 以 Return/Returns/Yield/Yields 开头且首句足够描述返回值时也可省略

## C. 可套用模板

模块：
```python
"""A one-line summary of the module, terminated by a period.

Leave one blank line. The rest of this docstring should contain an
overall description of the module. Optionally, it may also contain a
brief description of exported classes and functions and/or usage examples.

Typical usage example:

  foo = ClassFoo()
  bar = foo.function_bar()
"""
```

函数（Args/Returns/Raises 完整式）：
```python
def fetch_bigtable_rows(big_table, keys, other_silly_variable=None):
    """Fetches rows from a Bigtable.

    Retrieves rows pertaining to the given keys from the Table instance
    represented by big_table.

    Args:
        big_table: An open Bigtable Table instance.
        keys: A sequence of strings representing the key of each table row
            to fetch.
        other_silly_variable: Another optional variable, that has a much
            longer name than the other args, and which does nothing.

    Returns:
        A dict mapping keys to the corresponding table row data fetched from
        Bigtable. Each row is represented as a tuple of strings.

    Raises:
        IOError: An error occurred accessing the bigtable.Table object.
    """
```

类（含 `__init__`）：
```python
class SampleClass:
    """Summary of class here.

    Longer class information...

    Attributes:
        likes_spam: A boolean indicating if we like SPAM or not.
        eggs: An integer count of the eggs we have laid.
    """

    def __init__(self, likes_spam=False):
        """Inits SampleClass with blah."""
        self.likes_spam = likes_spam
        self.eggs = 0
```

## D. TODO 格式

- 新格式（推荐）：`# TODO: crbug.com/192795 - Investigate cpufreq optimizations.`（大写 TODO + 冒号 + 链接/上下文 + 连字符 + 说明）
- 旧格式（新代码不推荐）：`# TODO(crbug.com/192795): Investigate ...`
- **禁止**以个人/团队为上下文。原文："Avoid adding TODOs that refer to an individual or team as the context"
- 未来型 TODO 必须给具体日期或事件。原文："make sure that you either include a very specific date (\"Fix by November 2009\") or a very specific event (\"Remove this code when all clients can handle XML responses.\")"

## E. 语言特有规则

- 小节标题固定拼写：`Args:`、`Returns:`、`Yields:`、`Raises:`、`Attributes:`；冒号结尾，悬挂缩进 2 或 4 空格（文件内一致）
- Args：参数名 + 冒号 + 描述；无类型注解时描述须含类型；`*foo`/`**bar` 按原样列出
- 生成器用 `Yields:`（记录 `next()` 返回的对象，而非生成器对象本身）
- Raises：只列接口相关异常；**不记录**"违反 API 时"抛的异常（否则等于把违规行为纳入 API）
- docstring 描述调用语法与语义，一般不写实现细节（除非与用法相关）；副作用（如修改参数）必须注明
- 风格：描述式（"Fetches rows..."）或祈使式（"Fetch rows..."）均可，但**同一文件内一致**
- `@property` 的 docstring 按属性风格写（`"""The Bigtable path."""`，而非 `"""Returns the Bigtable path."""`）
- 元组返回值不用旧 NumPy 风格，写 `Returns: A tuple (mat_a, mat_b), where mat_a is ..., and ...`
- 删除未用参数必须加注释解释（`"Unused."` 即可）
- 可变全局状态须在注释或注释链接的文档中解释设计原因
- 数学记号命名须在注释或 docstring 中引用来源
- docstring 摘要行必须保持在 80 字符内；docstring 必须用 `"""`（无论项目多行字符串引号偏好）

## F. 反例

```python
# BAD: 复述代码
# Now go through the b array and make sure whenever i occurs
# the next element is i+1

i += 1  # BAD: 显而易见的注释

"""Tests for foo.bar."""  # BAD: 对新信息无贡献的 docstring
```

- `"""Returns the Bigtable path."""` 用作 @property docstring（应写 `"""The Bigtable path."""`）

## G. 审查清单

- [ ] 公共 API / 非平凡 / 非直观函数都有 docstring？
- [ ] 模块 docstring 存在且以 ≤80 字符摘要行开头、句号结尾？
- [ ] docstring 用 `"""`？摘要行后有空行（如有正文）？
- [ ] Args/Returns/Yields/Raises/Attributes 格式正确（冒号结尾、悬挂缩进 2 或 4 空格且文件内一致）？
- [ ] 无类型注解的参数在 Args 中说明了类型？
- [ ] 生成器用 `Yields:` 而非 `Returns:`？
- [ ] Raises 未记录"API 被违反时"的异常？
- [ ] 行尾注释与代码间隔 ≥2 空格、`#` 后 ≥1 空格？
- [ ] 注释解释 why 而非复述 what？
- [ ] TODO 采用 `TODO: 链接 - 说明` 新格式、无个人名？
- [ ] 被装饰函数的 docstring 描述装饰后行为？
- [ ] 无新增 `# type:` 行尾注释？

## H. 易误引的"不存在"规则

- **无** Deprecation 注释规则（无 `# Deprecated:` 之类格式）
- **无** 节分隔符/注释框规则
- **无** `__init__` 必须有 docstring 的独立条款（由通用函数规则与示例覆盖）
- 旧版流传的 `TODO(username):` 括号格式在 Python 中**已不推荐新代码使用**（新代码用链接式）
