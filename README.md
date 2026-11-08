# club-skills

温州大学开放原子开源社团的 Agent Skills 集合。每个技能是一个自包含目录，按需安装，适用于各类支持 [Agent Skills](https://agentskills.io/specification) 规范的 AI 客户端。

## 安装

前置条件：GitHub CLI **2.90.0 或以上**（用 `gh --version` 确认），并已执行 `gh auth login`。

> `gh skill` 目前是 public preview，参数行为可能变动，以 `gh skill install --help` 的实际输出为准。

### 通用安装（多数客户端）

```bash
gh skill install <owner>/club-skills <skill-name> --agent universal --scope user
```

装到 `~/.agents/skills/`，Claude Code、Codex、Cursor、OpenCode、Gemini CLI 等都会读取该目录。

### 指定客户端

```bash
gh skill install <owner>/club-skills <skill-name> --agent claude-code --scope user
gh skill install <owner>/club-skills <skill-name> --agent codex --scope user
gh skill install <owner>/club-skills <skill-name> --agent cursor --scope user
```

完整取值见 `gh skill install --help`。

### 客户端不在支持列表

用 `--dir` 直接指向该客户端的 skills 根目录。例如 WorkBuddy：

```bash
gh skill install <owner>/club-skills <skill-name> --dir ~/.workbuddy/skills
```

### 注意事项

- `--scope` 默认是 `project`，装到用户级必须显式写 `--scope user`。
- `--dir` 会覆盖 `--agent` 与 `--scope`，三者不要混写。
- 需要可复现安装时用 `--pin <tag 或 commit SHA>`。`gh skill` 解析版本走 git tag，不读 `SKILL.md` 中的 `metadata.version`。
- 安装前建议先 `gh skill preview <owner>/club-skills <skill-name>` 检查内容。技能未经验证于 GitHub，请自行审查后再安装。

### 更新

```bash
gh skill update --all
```

## 技能目录

<!-- SKILLS:START -->
_暂无技能，欢迎按 CONTRIBUTING.md 贡献。_
<!-- SKILLS:END -->

## 贡献

技能编写规范、命名前缀、外部技能引入的许可检查，以及提交流程，见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

[MIT](LICENSE)
