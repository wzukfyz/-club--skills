/**
 * PR 标题校验的测试用例。零依赖，只跑纯函数。
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { checkPrTitle } from './check-pr-title.mjs';

test('合规标题通过', () => {
  assert.deepEqual(checkPrTitle('feat: 增加备份完整性校验步骤'), []);
});

test('带 scope 与破坏性标记的标题通过', () => {
  assert.deepEqual(checkPrTitle('feat(api)!: 调整技能元数据结构'), []);
});

test('类型不在白名单时报错', () => {
  const problems = checkPrTitle('update: 改了点东西');
  assert.ok(problems.some((problem) => problem.includes('格式')));
});

test('描述为英文时报错', () => {
  const problems = checkPrTitle('feat: add backup check');
  assert.ok(problems.some((problem) => problem.includes('简体中文')));
});

test('描述以句号结尾时报错', () => {
  const problems = checkPrTitle('fix: 修正安装命令。');
  assert.ok(problems.some((problem) => problem.includes('句号')));
});

test('冒号后缺空格时报错', () => {
  const problems = checkPrTitle('feat:增加步骤');
  assert.ok(problems.some((problem) => problem.includes('格式')));
});

test('空标题报错', () => {
  assert.deepEqual(checkPrTitle('   '), ['标题为空']);
});

test('超长标题报错', () => {
  const problems = checkPrTitle(`feat: ${'很'.repeat(120)}`);
  assert.ok(problems.some((problem) => problem.includes('上限')));
});
