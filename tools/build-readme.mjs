/**
 * 扫描 skills/ 生成 README 的技能目录表。
 *
 * skills/ 目录是唯一数据源，不读取任何清单文件。输出必须跨机器稳定：
 * 排序用码点比较、链接一律用正斜杠、行尾固定 LF、文件末尾恰好一个换行。
 * 任一处不稳定都会让 --check 在不同平台上误报。
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FrontmatterError, parseFrontmatter } from './lib/frontmatter.mjs';

export const START_MARKER = '<!-- SKILLS:START -->';
export const END_MARKER = '<!-- SKILLS:END -->';
/** skills/ 为空时的占位文案，需与 README 现有内容保持一致。 */
export const EMPTY_HINT = '_暂无技能，欢迎按 CONTRIBUTING.md 贡献。_';

const README_FILE = 'README.md';
const SKILLS_DIR = 'skills';
const SUMMARY_LIMIT = 60;
/** 摘要截断点：命中任一句读符号即止。 */
const SUMMARY_STOP_CHARS = ['。', '；', '.', ';'];
const CONTEXT_LINES = 3;

/**
 * 读取所有技能元数据。缺 SKILL.md 的目录会被跳过，交由 validate 报告。
 *
 * @param {string} root 仓库根目录。
 * @returns {Array<{ name: string, description: string, tags: string[], version: string, owner: string }>}
 */
export function loadSkills(root) {
  const dir = path.join(root, SKILLS_DIR);
  if (!existsSync(dir)) return [];

  const skills = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const file = path.join(dir, entry.name, 'SKILL.md');
    if (!existsSync(file)) continue;

    const { data } = parseFrontmatter(readFileSync(file, 'utf8'));
    const metadata = data.metadata ?? {};
    skills.push({
      name: typeof data.name === 'string' ? data.name : entry.name,
      description: typeof data.description === 'string' ? data.description : '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      version: typeof metadata.version === 'string' ? metadata.version : '',
      owner: typeof metadata.owner === 'string' ? metadata.owner : '',
    });
  }
  return skills;
}

/**
 * 渲染标记之间的完整区块（含尾部换行），不包含标记本身。
 *
 * @param {Array<{ name: string, description: string, tags: string[], version: string, owner: string }>} skills
 * @returns {string}
 */
export function renderSection(skills) {
  if (skills.length === 0) return `${EMPTY_HINT}\n`;

  const rows = [...skills].sort(compareByName).map((skill) => {
    const tags = skill.tags.map(escapeCell).join(', ');
    const link = `skills/${skill.name}/SKILL.md`;
    return `| [${skill.name}](${link}) | ${summarize(skill.description)} | ${tags} | ${escapeCell(skill.version)} | ${escapeCell(skill.owner)} |`;
  });

  return ['| 技能 | 说明 | 标签 | 版本 | 负责人 |', '| --- | --- | --- | --- | --- |', ...rows, ''].join('\n');
}

/**
 * 把生成结果写回 README 文本。
 *
 * @returns {string | null} 标记缺失时返回 null。
 */
export function replaceSection(readme, section) {
  const start = readme.indexOf(START_MARKER);
  if (start === -1) return null;
  const end = readme.indexOf(END_MARKER, start + START_MARKER.length);
  if (end === -1) return null;

  const head = readme.slice(0, start + START_MARKER.length);
  const tail = readme.slice(end);
  return `${head}\n${section}${tail}`;
}

/**
 * 生成或校验 README。
 *
 * @param {string} root 仓库根目录。
 * @param {{ check?: boolean }} options check 为真时只比较不写入。
 */
export function build(root, { check = false } = {}) {
  const readmePath = path.join(root, README_FILE);
  const current = readFileSync(readmePath, 'utf8');
  const skills = loadSkills(root);
  const section = renderSection(skills);
  const next = replaceSection(current, section);

  if (next === null) {
    throw new Error(`README.md 缺少 ${START_MARKER} 或 ${END_MARKER} 标记`);
  }

  const changed = next !== current;
  if (check) {
    const diff = changed ? formatUnifiedDiff(splitLines(current), splitLines(next), README_FILE) : '';
    return { changed, skills, section, diff };
  }

  if (changed) writeFileSync(readmePath, next, 'utf8');
  return { changed, skills, section, diff: '' };
}

/**
 * 按 UTF-16 码点比较名称。不能用 localeCompare——它在 C locale 与 zh-CN 下结果不同，
 * 会让 --check 在不同机器上给出不一致的排序。
 */
function compareByName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

/** 截到第一个句读符号，再限制字符数。表格里的竖线需转义。 */
function summarize(description) {
  let cut = description.length;
  for (const stop of SUMMARY_STOP_CHARS) {
    const index = description.indexOf(stop);
    if (index > 0 && index < cut) cut = index;
  }

  const chars = [...description.slice(0, cut).trim()];
  const text = chars.length > SUMMARY_LIMIT ? `${chars.slice(0, SUMMARY_LIMIT).join('').trimEnd()}…` : chars.join('');
  return text.replaceAll('|', '\\|');
}

/** 表格单元格转义。 */
function escapeCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

/** 统一按 LF 切行，避免 CRLF 参与比较。 */
function splitLines(text) {
  return text.replaceAll('\r\n', '\n').split('\n');
}

/**
 * 输出带上下文的 unified diff，方便贡献者看清到底哪几行不一致。
 *
 * @param {string[]} oldLines 当前内容。
 * @param {string[]} newLines 生成结果。
 * @param {string} label 文件名。
 */
export function formatUnifiedDiff(oldLines, newLines, label) {
  const ops = buildOps(oldLines, newLines);
  const keep = new Array(ops.length).fill(false);

  ops.forEach((op, index) => {
    if (op.type === 'equal') return;
    const from = Math.max(0, index - CONTEXT_LINES);
    const to = Math.min(ops.length - 1, index + CONTEXT_LINES);
    for (let i = from; i <= to; i += 1) keep[i] = true;
  });

  if (!keep.includes(true)) return '';

  const oldBefore = [];
  const newBefore = [];
  let oldSeen = 0;
  let newSeen = 0;
  for (const op of ops) {
    oldBefore.push(oldSeen);
    newBefore.push(newSeen);
    if (op.type !== 'add') oldSeen += 1;
    if (op.type !== 'del') newSeen += 1;
  }

  const out = [`--- ${label}（当前）`, `+++ ${label}（生成结果）`];
  let index = 0;
  while (index < ops.length) {
    if (!keep[index]) {
      index += 1;
      continue;
    }
    let end = index;
    while (end + 1 < ops.length && keep[end + 1]) end += 1;
    out.push(renderHunk(ops, index, end, oldBefore, newBefore));
    index = end + 1;
  }
  return out.join('\n');
}

/** 用最长公共子序列把两份文本拆成 equal/del/add 序列。 */
function buildOps(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'equal', text: a[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', text: a[i] });
      i += 1;
    } else {
      ops.push({ type: 'add', text: b[j] });
      j += 1;
    }
  }
  while (i < n) {
    ops.push({ type: 'del', text: a[i] });
    i += 1;
  }
  while (j < m) {
    ops.push({ type: 'add', text: b[j] });
    j += 1;
  }
  return ops;
}

/** 渲染单个 hunk，含 @@ 行号头。 */
function renderHunk(ops, from, to, oldBefore, newBefore) {
  const oldStart = oldBefore[from] + 1;
  const newStart = newBefore[from] + 1;
  const body = [];
  let oldCount = 0;
  let newCount = 0;

  for (let i = from; i <= to; i += 1) {
    const op = ops[i];
    if (op.type === 'del') {
      body.push(`-${op.text}`);
      oldCount += 1;
    } else if (op.type === 'add') {
      body.push(`+${op.text}`);
      newCount += 1;
    } else {
      body.push(` ${op.text}`);
      oldCount += 1;
      newCount += 1;
    }
  }

  return [`@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`, ...body].join('\n');
}

/** 命令行入口。 */
function main() {
  const check = process.argv.includes('--check');
  try {
    const result = build(process.cwd(), { check });
    if (check && result.changed) {
      console.error(result.diff);
      console.error('\nREADME 技能目录与 skills/ 不一致，请运行 node tools/build-readme.mjs 后提交。');
      process.exitCode = 1;
      return;
    }
    console.log(check ? 'README 技能目录已是最新。' : `已更新 README 技能目录，共 ${result.skills.length} 个技能。`);
  } catch (error) {
    if (error instanceof FrontmatterError) {
      console.error(`解析失败：${error.message}`);
    } else {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) main();
