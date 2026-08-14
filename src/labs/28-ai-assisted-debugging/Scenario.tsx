/**
 * Lab 28 — AI 辅助调试（v4 结业）
 *
 * 教"如何写好调试 prompt"：给上下文 / 给堆栈 / 给复现步骤 / 要求列假设。
 * Scenario 展示一个真实错误堆栈 + 好坏 prompt 对照。
 * 反思型验证。
 */

import { useState } from 'react';
import './Scenario.css';

const STACK_TRACE = `TypeError: Cannot read properties of undefined (reading 'map')
    at MetricsTable (MetricsTable.tsx:23:18)
    at renderWithHooks (react-dom.development.js:15486:18)
    at mountIndeterminateComponent (react-dom.development.js:20074:13)
    at beginWork (react-dom.development.js:21582:16)`;

const BAD_PROMPT = `我的代码坏了，帮我看看`;

const GOOD_PROMPT = `我在 React 18 + TypeScript 项目里遇到这个错误：

${STACK_TRACE}

相关代码（MetricsTable.tsx:20-25）：
\`\`\`tsx
export function MetricsTable({ data }: { data: Metric[] }) {
  return (
    <table>
      <tbody>
        {data.map(m => <tr key={m.id}><td>{m.name}</td></tr>)}
      </tbody>
    </table>
  );
}
\`\`\`

复现步骤：首次进入页面立即报错；刷新一次后正常。
data 来自父组件的 useEffect fetch，初始值用 useState(undefined)。

请：
1. 解释错误的直接原因
2. 列出 2-3 个可能的根因假设（按可能性排序）
3. 对每个假设给出验证方法
4. 推荐最可能的修复方案（含代码）`;

export function AiAssistedDebuggingScenario() {
  const [showGood, setShowGood] = useState(false);

  return (
    <div className="aidbg">
      <h3>🤖 AI 辅助调试</h3>
      <p className="aidbg__lead">
        AI（Claude / ChatGPT / Copilot）能加速调试——前提是你把上下文喂够。这关教你写
        "调试 prompt"的四个要素。
      </p>

      <section className="aidbg__section">
        <h4>原始错误</h4>
        <pre className="aidbg__pre">{STACK_TRACE}</pre>
      </section>

      <section className="aidbg__section">
        <h4>❌ 坏 prompt</h4>
        <pre className="aidbg__pre aidbg__pre--bad">{BAD_PROMPT}</pre>
        <p className="aidbg__note">——AI 只能泛泛回答"检查变量是否 undefined"。</p>
      </section>

      <section className="aidbg__section">
        <h4>✅ 好 prompt（四要素齐备）</h4>
        {!showGood ? (
          <button type="button" className="btn btn--primary" onClick={() => setShowGood(true)}>
            展示完整好 prompt
          </button>
        ) : (
          <pre className="aidbg__pre aidbg__pre--good">{GOOD_PROMPT}</pre>
        )}
      </section>

      <p className="aidbg__hint">
        四要素：<strong>① 完整堆栈 ② 相关代码片段 ③ 复现步骤 ④ 明确的输出要求</strong>（解释
        + 列假设 + 验证方法 + 修复方案）。
      </p>
    </div>
  );
}
