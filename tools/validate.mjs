/**
 * 仓库全量校验。
 *
 * 检查结构、元数据、正文与 README 一致性，任一失败即以非零码退出。
 * 输出形如 `路径:行号: 原因`；在 GitHub Actions 中额外输出注解，
 * 让 PR 页面直接跳到出错的位置。
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FrontmatterError, isSemver, isValidName, isValidTag, parseFrontmatter } from './lib/frontmatter.mjs';
import { END_MARKER, START_MARKER, renderSection } from './build-readme.mjs';

export const PREFIXES = ['ai', 'dev', 'doc', 'evt', 'ops', 'sec'];

const SKILLS_DIR = 'skills';
const README_FILE = 'README.md';

/** 三个必填章节，缺任一项即失败。 */
const REQUIRED_SECTIONS = ['适用场景', '步骤', '验收标准'];
/** 五个固定章节的先后次序；可选的可以整节省略，但只要出现就必须落在位次上。 */
const ORDERED_SECTIONS = ['适用场景', '前置条件', '步骤', '异常处理', '验收标准'];
/** 唯一允许追加在末尾的可选章节。 */
const TAIL_SECTION = '参考资料';
const ALLOWED_SECTIONS = new Set([...ORDERED_SECTIONS, TAIL_SECTION]);

const MAX_SKILL_LINES = 500;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_SKILL_BYTES = 10 * 1024 * 1024;

const DESC_MIN = 10;
const DESC_MAX = 1024;
const OWNER_MIN = 2;
const OWNER_MAX = 40;
const TAGS_MIN = 1;
const TAGS_MAX = 5;

/**
 * 校验整个仓库。
 *
 * @param {string} root 仓库根目录。
 * @returns {Array<{ file: string, line: number, reason: string }>} 按文件与行号排序的问题列表。
 */
export function validateRepo(root) {
  const errors = [];
  const add = (file, line, reason) => errors.push({ file, line, reason });

  const skillsRoot = path.join(root, SKILLS_DIR);
  const dirNames = [];

  if (existsSync(skillsRoot)) {
    for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
      const rel = `${SKILLS_DIR}/${entry.name}`;
      if (entry.name.startsWith('.')) {
        add(rel, 1, 'skills/ 下不允许隐藏文件或目录');
        continue;
      }
      if (!entry.isDirectory()) {
        add(rel, 1, 'skills/ 下只允许目录，每个技能独立成一个目录');
        continue;
      }
      if (readdirSync(path.join(skillsRoot, entry.name)).length === 0) {
        add(rel, 1, '不允许空目录');
        continue;
      }
      dirNames.push(entry.name);
    }
  }

  const skills = [];
  for (const dirName of dirNames.sort()) {
    const skill = inspectSkill(root, dirName, add);
    if (skill) skills.push(skill);
  }

  checkReadme(root, skills, add);

  return errors.sort((a, b) => {
    if (a.file !== b.file) return a.file < b.file ? -1 : 1;
    return a.line - b.line;
  });
}

/**
 * 校验单个技能目录。
 *
 * @returns {object | null} 解析成功时返回供 README 比对用的元数据。
 */
function inspectSkill(root, dirName, add) {
  const dirAbs = path.join(root, SKILLS_DIR, dirName);
  const relDir = `${SKILLS_DIR}/${dirName}`;
  const fileAbs = path.join(dirAbs, 'SKILL.md');
  const relFile = `${relDir}/SKILL.md`;

  if (!existsSync(fileAbs)) {
    add(relDir, 1, '缺少 SKILL.md');
    return null;
  }

  checkHiddenEntries(dirAbs, relDir, add);
  checkSizes(dirAbs, relDir, add);
  checkDerivedNotice(dirAbs, relDir, add);
  checkRelativeLinks(dirAbs, relDir, add);

  const text = readFileSync(fileAbs, 'utf8');
  const lines = text.split(/\r?\n/);
  const lineCount = lines.length - (lines[lines.length - 1] === '' ? 1 : 0);
  if (lineCount > MAX_SKILL_LINES) {
    add(relFile, lineCount, `共 ${lineCount} 行，超过 ${MAX_SKILL_LINES} 行上限，请把细节移入 references/`);
  }

  let parsed;
  try {
    parsed = parseFrontmatter(text);
  } catch (error) {
    if (error instanceof FrontmatterError) {
      add(relFile, error.line, error.reason);
      return null;
    }
    throw error;
  }

  const { data, body, bodyLine, keyLines } = parsed;
  const meta = data.metadata;
  const lineOf = (key) => keyLines[key] ?? 1;

  checkName(relFile, dirName, data.name, lineOf('name'), add);
  checkDescription(relFile, data.description, lineOf('description'), add);
  checkMetadata(relFile, meta, lineOf, add);
  checkBody(relFile, body, bodyLine, add);

  return {
    name: typeof data.name === 'string' ? data.name : dirName,
    description: typeof data.description === 'string' ? data.description : '',
    tags: Array.isArray(meta?.tags) ? meta.tags : [],
    version: typeof meta?.version === 'string' ? meta.version : '',
    owner: typeof meta?.owner === 'string' ? meta.owner : '',
  };
}

/** name 与目录名、格式、前缀三件事一次判完。 */
function checkName(relFile, dirName, name, line, add) {
  if (typeof name !== 'string' || name === '') {
    add(relFile, 1, 'frontmatter 缺少必填字段 name');
    return;
  }
  if (name !== dirName) {
    add(relFile, line, `name（${name}）与目录名（${dirName}）不一致`);
    return;
  }
  if (!isValidName(name)) {
    add(relFile, line, 'name 必须形如 `前缀-语义`，仅含小写字母、数字与连字符，长度不超过 64');
    return;
  }
  const prefix = name.slice(0, name.indexOf('-'));
  if (!PREFIXES.includes(prefix)) {
    const allowed = PREFIXES.map((item) => `${item}-`).join(' ');
    add(relFile, line, `name 的前缀 \`${prefix}-\` 不在白名单内，可用：${allowed}`);
  }
}

/** description 长度约束。 */
function checkDescription(relFile, description, line, add) {
  if (typeof description !== 'string' || description === '') {
    add(relFile, 1, 'frontmatter 缺少必填字段 description');
    return;
  }
  if (description.length < DESC_MIN || description.length > DESC_MAX) {
    add(relFile, line, `description 长度为 ${description.length}，应在 ${DESC_MIN}–${DESC_MAX} 之间`);
  }
}

/** metadata 下三个必填键。 */
function checkMetadata(relFile, meta, lineOf, add) {
  if (!meta) {
    add(relFile, 1, 'frontmatter 缺少必填的 metadata 块');
    return;
  }

  const tagsLine = lineOf('metadata.tags');
  if (!Array.isArray(meta.tags)) {
    add(relFile, 1, 'frontmatter 缺少必填字段 metadata.tags');
  } else if (meta.tags.length < TAGS_MIN || meta.tags.length > TAGS_MAX) {
    add(relFile, tagsLine, `metadata.tags 有 ${meta.tags.length} 个，应为 ${TAGS_MIN}–${TAGS_MAX} 个`);
  } else {
    const seen = new Set();
    for (const tag of meta.tags) {
      if (seen.has(tag)) add(relFile, tagsLine, `metadata.tags 重复：${tag}`);
      seen.add(tag);
      if (!isValidTag(tag)) add(relFile, tagsLine, `tag \`${tag}\` 不合法，只能含小写字母、数字与连字符`);
    }
  }

  if (typeof meta.version !== 'string' || meta.version === '') {
    add(relFile, 1, 'frontmatter 缺少必填字段 metadata.version');
  } else if (!isSemver(meta.version)) {
    add(relFile, lineOf('metadata.version'), `metadata.version（${meta.version}）不是合法 SemVer，且不能带 v 前缀`);
  }

  if (typeof meta.owner !== 'string' || meta.owner === '') {
    add(relFile, 1, 'frontmatter 缺少必填字段 metadata.owner');
  } else if (meta.owner.length < OWNER_MIN || meta.owner.length > OWNER_MAX) {
    add(relFile, lineOf('metadata.owner'), `metadata.owner 长度为 ${meta.owner.length}，应在 ${OWNER_MIN}–${OWNER_MAX} 之间`);
  }
}

/** 正文章节：白名单、重复、顺序、必填非空、末尾章节位置。 */
function checkBody(relFile, body, bodyLine, add) {
  const bodyLines = body.split(/\r?\n/);
  const headings = [];
  bodyLines.forEach((lineText, index) => {
    if (/^##\s+\S/.test(lineText)) {
      headings.push({ title: lineText.replace(/^##\s+/, '').trim(), line: bodyLine + index, index });
    }
  });

  const titles = headings.map((heading) => heading.title);

  for (const heading of headings) {
    if (!ALLOWED_SECTIONS.has(heading.title)) {
      add(relFile, heading.line, `不允许的顶层章节「${heading.title}」，允许：${[...ALLOWED_SECTIONS].join(' / ')}`);
    }
  }

  const counts = new Map();
  for (const title of titles) counts.set(title, (counts.get(title) ?? 0) + 1);
  for (const [title, count] of counts) {
    if (count > 1 && ALLOWED_SECTIONS.has(title)) {
      add(relFile, headings.find((heading) => heading.title === title).line, `章节「## ${title}」重复出现`);
    }
  }

  const positions = ORDERED_SECTIONS.map((title) => titles.indexOf(title)).filter((index) => index !== -1);
  const sorted = [...positions].sort((a, b) => a - b);
  if (positions.join(',') !== sorted.join(',')) {
    add(relFile, 1, `固定章节顺序错误，应为 ${ORDERED_SECTIONS.join(' → ')}`);
  }

  for (const title of REQUIRED_SECTIONS) {
    const index = titles.indexOf(title);
    if (index === -1) {
      add(relFile, 1, `缺少必需章节「## ${title}」`);
      continue;
    }
    if (!sectionHasContent(bodyLines, headings, index)) {
      add(relFile, headings[index].line, `章节「## ${title}」内容为空`);
    }
  }

  const tailIndex = titles.indexOf(TAIL_SECTION);
  if (tailIndex !== -1 && tailIndex !== titles.length - 1) {
    add(relFile, headings[tailIndex].line, `「## ${TAIL_SECTION}」必须是最后一个顶层章节`);
  }
}

/** 判断某章节在下一个标题之前是否有实质内容。 */
function sectionHasContent(bodyLines, headings, index) {
  const start = headings[index].index + 1;
  const end = index + 1 < headings.length ? headings[index + 1].index : bodyLines.length;
  for (let i = start; i < end; i += 1) {
    const lineText = bodyLines[i].trim();
    if (lineText !== '' && lineText !== '---') return true;
  }
  return false;
}

/** 技能目录内不允许隐藏文件、也顺带递归检查空目录。 */
function checkHiddenEntries(dirAbs, relBase, add) {
  for (const entry of readdirSync(dirAbs, { withFileTypes: true })) {
    const rel = `${relBase}/${entry.name}`;
    if (entry.name.startsWith('.')) {
      add(rel, 1, '技能目录内不允许隐藏文件或目录');
      continue;
    }
    if (!entry.isDirectory()) continue;

    const childAbs = path.join(dirAbs, entry.name);
    if (readdirSync(childAbs).length === 0) {
      add(rel, 1, '不允许空目录');
      continue;
    }
    checkHiddenEntries(childAbs, rel, add);
  }
}

/** 单文件与整个技能的体积上限。 */
function checkSizes(dirAbs, relBase, add) {
  const files = collectFiles(dirAbs, relBase);
  let total = 0;
  for (const file of files) {
    total += file.size;
    if (file.size > MAX_FILE_BYTES) {
      add(file.rel, 1, `文件 ${formatBytes(file.size)}，超过单文件 ${formatBytes(MAX_FILE_BYTES)} 上限`);
    }
  }
  if (total > MAX_SKILL_BYTES) {
    add(relBase, 1, `技能总体积 ${formatBytes(total)}，超过 ${formatBytes(MAX_SKILL_BYTES)} 上限`);
  }
}

/** 派生技能必须自带 LICENSE 与 NOTICE：单技能安装不会带上仓库根的许可文件。 */
function checkDerivedNotice(dirAbs, relBase, add) {
  const hasLicense = existsSync(path.join(dirAbs, 'LICENSE'));
  const hasNotice = existsSync(path.join(dirAbs, 'NOTICE'));
  if (hasLicense !== hasNotice) {
    add(relBase, 1, '派生技能必须同时提供 LICENSE 与 NOTICE');
  }
}

/** 禁止跨技能相对引用：单技能安装后其他技能目录并不存在。 */
function checkRelativeLinks(dirAbs, relBase, add) {
  for (const file of collectFiles(dirAbs, relBase)) {
    if (!file.rel.toLowerCase().endsWith('.md')) continue;
    const lines = readFileSync(file.abs, 'utf8').split(/\r?\n/);
    lines.forEach((lineText, index) => {
      if (lineText.includes('../')) {
        add(file.rel, index + 1, '禁止跨技能相对引用（出现 ../），单技能安装后目标文件不存在');
      }
    });
  }
}

/** 递归收集普通文件及其大小。 */
function collectFiles(dirAbs, relBase, acc = []) {
  for (const entry of readdirSync(dirAbs, { withFileTypes: true })) {
    const childAbs = path.join(dirAbs, entry.name);
    const rel = `${relBase}/${entry.name}`;
    if (entry.isDirectory()) {
      collectFiles(childAbs, rel, acc);
    } else if (entry.isFile()) {
      acc.push({ abs: childAbs, rel, size: statSync(childAbs).size });
    }
  }
  return acc;
}

/** README 自动区块必须与 skills/ 的渲染结果逐字一致。 */
function checkReadme(root, skills, add) {
  const readmePath = path.join(root, README_FILE);
  if (!existsSync(readmePath)) {
    add(README_FILE, 1, '缺少 README.md');
    return;
  }

  // 先归一化行尾：CRLF 只是检出产物，不该让比对失败。
  const text = readFileSync(readmePath, 'utf8').replaceAll('\r\n', '\n');
  const start = text.indexOf(START_MARKER);
  const end = text.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) {
    add(README_FILE, 1, `缺少 ${START_MARKER} 或 ${END_MARKER} 标记`);
    return;
  }

  const actual = text.slice(start + START_MARKER.length, end);
  const expected = `\n${renderSection(skills)}`;
  if (actual === expected) return;

  const lineNo = text.slice(0, start).split('\n').length;
  add(README_FILE, lineNo, '技能目录与 skills/ 不一致，请运行 node tools/build-readme.mjs 后提交');
}

/** 人类可读的体积。 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** 命令行入口。 */
function main() {
  const errors = validateRepo(process.cwd());
  if (errors.length === 0) {
    console.log('校验通过。');
    return;
  }

  const inActions = process.env.GITHUB_ACTIONS === 'true';
  for (const error of errors) {
    console.error(`${error.file}:${error.line}: ${error.reason}`);
    if (inActions) console.log(`::error file=${error.file},line=${error.line}::${error.reason}`);
  }
  console.error(`\n共 ${errors.length} 处问题。`);
  process.exitCode = 1;
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) main();
