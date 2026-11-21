/**
 * README 技能表渲染的测试用例。只覆盖摘要截断与转义这两处易回归的逻辑。
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { EMPTY_HINT, renderSection } from './build-readme.mjs';

const BASE = { tags: ['doc'], version: '1.0.0', owner: '运维部' };

/** 渲染一个技能，取出「说明」列的最终文本。 */
function summaryOf(description) {
  const section = renderSection([{ ...BASE, name: 'doc-demo', description }]);
  const row = section.split('\n').find((line) => line.startsWith('| [doc-demo]'));
  return row.split('|')[2].trim();
}

test('首句过短时摘要延伸到下一个句读', () => {
  const summary = summaryOf('短标题。这是一句足够长的补充说明，用来验证摘要会继续延伸。');

  assert.ok(summary.includes('这是一句足够长的补充说明'), `实际摘要：${summary}`);
  assert.notEqual(summary, '短标题');
});

test('首句够长时只取首句', () => {
  const summary = summaryOf('这是一句足够长的说明，超过二十个字符所以直接截断在这里。后面这一句不应该出现。');

  assert.ok(summary.startsWith('这是一句足够长的说明'), `实际摘要：${summary}`);
  assert.ok(!summary.includes('后面这一句'), `实际摘要：${summary}`);
});

test('文件名里的点号不当作句读', () => {
  const summary = summaryOf('这是关于 .md 文件的说明，整句足够长所以应当被完整保留下来。');

  assert.ok(summary.includes('.md'), `实际摘要：${summary}`);
  assert.ok(summary.includes('完整保留下来'), `实际摘要：${summary}`);
});

test('摘要中的竖线被转义', () => {
  const section = renderSection([
    { ...BASE, name: 'doc-demo', description: '这句说明里带了竖线 a|b 用来验证转义逻辑是否正确。' },
  ]);

  assert.ok(section.includes('a\\|b'), `实际渲染：${section}`);
});

test('没有技能时输出占位文案', () => {
  assert.equal(renderSection([]), `${EMPTY_HINT}\n`);
});
