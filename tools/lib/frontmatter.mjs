/**
 * SKILL.md 的 frontmatter 解析器。
 *
 * 只实现仓库规范定义的语法子集：按第一个「冒号 + 空格」切分键值、不解析引号、
 * 不做类型推断、数组语法仅用于 metadata.tags。超出子集的写法一律抛错，
 * 避免静默降级让元数据被悄悄读错。
 */

/** 技能名：必须含连字符，以此强制 `前缀-语义` 形式。 */
const NAME_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;
/** 标签：同为 kebab-case，但允许单段。 */
const TAG_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
/** SemVer 2.0.0，不接受 `v` 前缀。 */
const SEMVER_PATTERN = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
/** frontmatter 键名。 */
const KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;
/** 块标量取值，如 `|`、`>-`。 */
const BLOCK_SCALAR_PATTERN = /^[|>][+-]?$/;

export const MAX_NAME_LENGTH = 64;

/**
 * frontmatter 语法错误，携带行号以便定位与生成 CI 注解。
 */
export class FrontmatterError extends Error {
  /**
   * @param {number} line 出错行号，从 1 起。
   * @param {string} reason 面向贡献者的中文原因。
   */
  constructor(line, reason) {
    super(`${reason}（第 ${line} 行）`);
    this.name = 'FrontmatterError';
    this.line = line;
    this.reason = reason;
  }
}

/**
 * 解析 SKILL.md 文本。
 *
 * @param {string} text 完整文件内容。
 * @returns {{ data: Record<string, unknown>, body: string, bodyLine: number, keyLines: Record<string, number> }}
 *   `bodyLine` 为正文首行的行号，`keyLines` 记录每个键所在行，供报错定位。
 * @throws {FrontmatterError} 语法越界。
 */
export function parseFrontmatter(text) {
  if (typeof text !== 'string') {
    throw new TypeError('parseFrontmatter 需要字符串输入');
  }
  if (text.charCodeAt(0) === 0xfeff) {
    throw new FrontmatterError(1, '文件含 UTF-8 BOM，请另存为无 BOM 的 UTF-8');
  }

  const lines = text.split(/\r?\n/);
  if (lines[0].trimEnd() !== '---') {
    throw new FrontmatterError(1, '第一行必须是 ---');
  }

  let closeIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trimEnd() === '---') {
      closeIndex = i;
      break;
    }
  }
  if (closeIndex === -1) {
    throw new FrontmatterError(1, 'frontmatter 未闭合，缺少单独的 --- 行');
  }

  const data = {};
  const keyLines = {};
  const seenTopLevel = new Set();
  let metadata = null;
  let inMetadata = false;

  for (let i = 1; i < closeIndex; i += 1) {
    const raw = lines[i];
    const lineNo = i + 1;
    if (raw.trim() === '') continue;
    // 只支持整行注释；行内的 # 是普通字符。
    if (/^\s*#/.test(raw)) continue;

    const indent = raw.length - raw.trimStart().length;
    if (indent !== 0 && indent !== 2) {
      throw new FrontmatterError(lineNo, '缩进只能是 0 或 2 个空格，不支持更深的层级');
    }

    const { key, value } = splitPair(raw.trim(), lineNo);

    if (indent === 2) {
      if (!inMetadata) {
        throw new FrontmatterError(lineNo, '缩进 2 个空格的键值只能出现在 metadata 块内');
      }
      if (Object.hasOwn(metadata, key)) {
        throw new FrontmatterError(lineNo, `metadata 中重复的键 ${key}`);
      }
      metadata[key] = key === 'tags' ? parseTags(value, lineNo) : requireValue(value, key, lineNo);
      keyLines[`metadata.${key}`] = lineNo;
      continue;
    }

    if (seenTopLevel.has(key)) {
      throw new FrontmatterError(lineNo, `重复的顶层键 ${key}`);
    }
    seenTopLevel.add(key);
    // 新的顶层键意味着 metadata 块结束。
    inMetadata = false;

    if (key === 'metadata') {
      if (value !== '') {
        throw new FrontmatterError(lineNo, 'metadata 必须是缩进映射，不能写成单行值');
      }
      metadata = {};
      inMetadata = true;
      keyLines.metadata = lineNo;
      continue;
    }

    data[key] = requireValue(value, key, lineNo);
    keyLines[key] = lineNo;
  }

  if (metadata !== null) data.metadata = metadata;

  return {
    data,
    body: lines.slice(closeIndex + 1).join('\n'),
    bodyLine: closeIndex + 2,
    keyLines,
  };
}

/** 技能名合法性：kebab-case、含至少一个连字符、长度不超上限。 */
export function isValidName(value) {
  return typeof value === 'string' && value.length <= MAX_NAME_LENGTH && NAME_PATTERN.test(value);
}

/** 标签合法性。 */
export function isValidTag(value) {
  return typeof value === 'string' && TAG_PATTERN.test(value);
}

/** SemVer 合法性。 */
export function isSemver(value) {
  return typeof value === 'string' && SEMVER_PATTERN.test(value);
}

/**
 * 把一行切成键与值。只认第一个「冒号 + 空格」，其余冒号属于值本身。
 *
 * @param {string} content 已去除缩进的行内容。
 * @param {number} lineNo 行号，用于报错。
 */
function splitPair(content, lineNo) {
  const colon = content.indexOf(':');
  if (colon === -1) {
    throw new FrontmatterError(lineNo, '缺少冒号，正确写法是 `key: value`');
  }

  const key = content.slice(0, colon);
  if (!KEY_PATTERN.test(key)) {
    throw new FrontmatterError(lineNo, `非法的键名 \`${key}\``);
  }

  const after = content.slice(colon + 1);
  if (after !== '' && !after.startsWith(' ')) {
    throw new FrontmatterError(lineNo, '冒号后必须有一个空格');
  }

  return { key, value: after.trim() };
}

/**
 * 取单行标量值。这里挡住会破坏行切分的几种 YAML 结构。
 *
 * @param {string} value 已 trim 的值。
 * @param {string} key 键名，用于报错。
 * @param {number} lineNo 行号，用于报错。
 */
function requireValue(value, key, lineNo) {
  if (value === '') {
    throw new FrontmatterError(lineNo, `${key} 的值不能为空`);
  }
  if (BLOCK_SCALAR_PATTERN.test(value)) {
    throw new FrontmatterError(lineNo, `${key} 不支持块标量写法`);
  }
  if (value.startsWith('&')) {
    throw new FrontmatterError(lineNo, `${key} 不支持 YAML 锚点`);
  }
  if (value.startsWith('[') || value.startsWith('{')) {
    throw new FrontmatterError(lineNo, `${key} 不能用数组或映射写法，数组只允许用于 metadata.tags`);
  }
  return value;
}

/**
 * 解析 `[a, b, c]` 形式的标签数组。按字符串处理，不做类型推断。
 *
 * @param {string} value 已 trim 的值。
 * @param {number} lineNo 行号，用于报错。
 * @returns {string[]}
 */
function parseTags(value, lineNo) {
  if (!value.startsWith('[') || !value.endsWith(']')) {
    throw new FrontmatterError(lineNo, 'metadata.tags 必须写成 [tag1, tag2] 形式');
  }

  const inner = value.slice(1, -1).trim();
  if (inner === '') return [];

  const items = inner.split(',').map((item) => item.trim());
  if (items.some((item) => item === '')) {
    throw new FrontmatterError(lineNo, 'metadata.tags 中存在空元素');
  }
  return items;
}
