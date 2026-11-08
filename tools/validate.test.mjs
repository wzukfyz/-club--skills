/**
 * 工具链自测：用临时目录构造仓库夹具，逐条验证校验规则。
 *
 * 只依赖 node:test 与 node:assert，不引入任何外部包。
 */

import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { END_MARKER, START_MARKER, renderSection } from './build-readme.mjs';
import { validateRepo } from './validate.mjs';

const VALID_META = {
  name: 'ops-demo',
  description: '演示用的运维技能，覆盖备份与恢复流程。当需要验证仓库结构时使用。',
  tags: ['ops', 'demo'],
  version: '1.0.0',
  owner: '运维部',
};

const VALID_BODY = [
  '# 运维演示',
  '',
  '## 适用场景',
  '',
  '需要验证仓库规范时使用。',
  '',
  '## 步骤',
  '',
  '1. 执行 `node tools/validate.mjs`。',
  '',
  '## 验收标准',
  '',
  '- [ ] 校验退出码为 0。',
  '',
].join('\n');

/** 建一个用完即删的临时仓库根目录。 */
function createRepo(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'club-skills-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

/** 按元数据拼出 frontmatter，未提供的键直接省略。 */
function writeSkill(root, meta = VALID_META, body = VALID_BODY, dirName = VALID_META.name) {
  const dir = path.join(root, 'skills', dirName);
  mkdirSync(dir, { recursive: true });

  const lines = ['---'];
  if (meta.name !== undefined) lines.push(`name: ${meta.name}`);
  if (meta.description !== undefined) lines.push(`description: ${meta.description}`);
  lines.push('metadata:');
  if (meta.tags !== undefined) lines.push(`  tags: [${meta.tags.join(', ')}]`);
  if (meta.version !== undefined) lines.push(`  version: ${meta.version}`);
  if (meta.owner !== undefined) lines.push(`  owner: ${meta.owner}`);
  lines.push('---', '');

  writeFileSync(path.join(dir, 'SKILL.md'), `${lines.join('\n')}${body}`, 'utf8');
  return dir;
}

/** README 的自动区块按渲染结果写入，避免无关用例被「表格不一致」干扰。 */
function writeReadme(root, record = VALID_META) {
  const content = `# 测试仓库\n\n${START_MARKER}\n${renderSection([record])}${END_MARKER}\n`;
  writeFileSync(path.join(root, 'README.md'), content, 'utf8');
}

/** 断言存在包含指定片段的问题。 */
function expectError(errors, fragment) {
  assert.ok(
    errors.some((error) => error.reason.includes(fragment)),
    `未找到包含「${fragment}」的问题，实际为：${JSON.stringify(errors, null, 2)}`,
  );
}

test('合规技能通过全部检查', (t) => {
  const root = createRepo(t);
  writeSkill(root);
  writeReadme(root);

  assert.deepEqual(validateRepo(root), []);
});

test('name 与目录名不一致时报错', (t) => {
  const root = createRepo(t);
  writeSkill(root, VALID_META, VALID_BODY, 'ops-other');
  writeReadme(root);

  expectError(validateRepo(root), '与目录名');
});

test('缺少 owner 时报错', (t) => {
  const root = createRepo(t);
  writeSkill(root, { ...VALID_META, owner: undefined });
  writeReadme(root);

  expectError(validateRepo(root), 'metadata.owner');
});

test('description 过短时报错', (t) => {
  const root = createRepo(t);
  writeSkill(root, { ...VALID_META, description: '备份' });
  writeReadme(root, { ...VALID_META, description: '备份' });

  expectError(validateRepo(root), 'description 长度');
});

test('tags 超过 5 个时报错', (t) => {
  const root = createRepo(t);
  const tags = ['a', 'b', 'c', 'd', 'e', 'f'];
  writeSkill(root, { ...VALID_META, tags });
  writeReadme(root, { ...VALID_META, tags });

  expectError(validateRepo(root), 'metadata.tags 有 6 个');
});

test('version 带 v 前缀时报错', (t) => {
  const root = createRepo(t);
  writeSkill(root, { ...VALID_META, version: 'v1.0.0' });
  writeReadme(root, { ...VALID_META, version: 'v1.0.0' });

  expectError(validateRepo(root), 'SemVer');
});

test('缺少验收标准时报错', (t) => {
  const root = createRepo(t);
  const body = ['# 运维演示', '', '## 适用场景', '', '随便写点。', '', '## 步骤', '', '1. 做一件事。', ''].join('\n');
  writeSkill(root, VALID_META, body);
  writeReadme(root);

  expectError(validateRepo(root), '缺少必需章节「## 验收标准」');
});

test('出现跨技能相对引用时报错', (t) => {
  const root = createRepo(t);
  const body = VALID_BODY.replace('需要验证仓库规范时使用。', '先看 [另一技能](../ops-other/SKILL.md)。');
  writeSkill(root, VALID_META, body);
  writeReadme(root);

  expectError(validateRepo(root), '禁止跨技能相对引用');
});

test('单文件超过 2MB 时报错', (t) => {
  const root = createRepo(t);
  const dir = writeSkill(root);
  writeReadme(root);

  const assets = path.join(dir, 'assets');
  mkdirSync(assets);
  writeFileSync(path.join(assets, 'big.bin'), Buffer.alloc(2 * 1024 * 1024 + 1));

  expectError(validateRepo(root), '超过单文件');
});

test('description 含半角冒号与井号仍可解析', (t) => {
  const root = createRepo(t);
  const description = '演示用法: 先备份再恢复，覆盖 #tag 形式的关键词。';
  writeSkill(root, { ...VALID_META, description });
  writeReadme(root, { ...VALID_META, description });

  assert.deepEqual(validateRepo(root), []);
});

test('version 写成 1.0 时按无法解析为 SemVer 报错', (t) => {
  const root = createRepo(t);
  writeSkill(root, { ...VALID_META, version: '1.0' });
  writeReadme(root, { ...VALID_META, version: '1.0' });

  expectError(validateRepo(root), 'SemVer');
});

test('前缀不在白名单时报错', (t) => {
  const root = createRepo(t);
  const meta = { ...VALID_META, name: 'foo-demo' };
  writeSkill(root, meta, VALID_BODY, 'foo-demo');
  writeReadme(root, meta);

  expectError(validateRepo(root), '不在白名单内');
});
