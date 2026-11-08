/**
 * 生成 Release 正文里的技能清单。
 *
 * 直接复用 build-readme 的扫描与渲染逻辑，让 Release 说明、README 表格
 * 与实际 skills/ 三者不会各说各话。
 */

import { loadSkills, renderSection } from './build-readme.mjs';

try {
  const skills = loadSkills(process.cwd());
  process.stdout.write(`## 本次快照包含的技能\n\n${renderSection(skills)}`);
} catch (error) {
  console.error(`生成技能清单失败：${error.message}`);
  process.exitCode = 1;
}
