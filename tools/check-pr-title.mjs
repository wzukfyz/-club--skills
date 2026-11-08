/**
 * 校验 PR 标题是否符合中文 Conventional Commits 约定。
 *
 * squash 合并时 PR 标题会直接成为提交信息，所以在合入前先把不合规的标题挡掉。
 * 标题优先取命令行参数，其次取环境变量 PR_TITLE，便于本地试跑与 CI 复用。
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TYPES = ['feat', 'fix', 'docs', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'style', 'revert'];
const HEADER_PATTERN = new RegExp(`^(${TYPES.join('|')})(\\([a-z0-9-]+\\))?!?: (.+)$`);
const CJK_PATTERN = /[\u4e00-\u9fff]/;
const MAX_HEADER_LENGTH = 100;

/**
 * 检查标题，返回问题列表；空数组表示合规。
 *
 * @param {string} title PR 标题。
 * @returns {string[]} 面向贡献者的中文问题描述。
 */
export function checkPrTitle(title) {
  const text = (title ?? '').trim();
  if (text === '') return ['标题为空'];

  const problems = [];
  if (text.length > MAX_HEADER_LENGTH) {
    problems.push(`标题 ${text.length} 字符，超过 ${MAX_HEADER_LENGTH} 字符上限`);
  }

  const matched = HEADER_PATTERN.exec(text);
  if (!matched) {
    problems.push(`标题不符合 \`<type>(<scope>): <中文描述>\` 格式，type 只能是 ${TYPES.join(' / ')}`);
    return problems;
  }

  const subject = matched[3];
  if (!CJK_PATTERN.test(subject)) {
    problems.push('描述部分必须使用简体中文');
  }
  if (subject.endsWith('。')) {
    problems.push('描述末尾不加句号');
  }
  return problems;
}

/** 命令行入口。 */
function main() {
  const title = process.argv[2] ?? process.env.PR_TITLE ?? '';
  const author = process.env.PR_AUTHOR ?? '';

  // 依赖更新一类机器人 PR 的标题是英文，放行以免挡住自动化。
  if (author.endsWith('[bot]')) {
    console.log(`跳过机器人提交的标题检查：${author}`);
    return;
  }

  const problems = checkPrTitle(title);
  if (problems.length === 0) {
    console.log(`标题合规：${title}`);
    return;
  }

  console.error(`标题不合规：${title}`);
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  console.error('\n参考格式：feat: 增加备份完整性校验步骤');

  console.log(`::error::PR 标题不合规：${problems.join('；')}`);
  process.exitCode = 1;
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) main();
