/**
 * Lab 23 — React DevTools
 *
 * Scenario: 一个"仪表盘"子树，父组件每秒更新 tick（context），
 * 所有子组件都没有 memo → 每秒全树 re-render。
 * 学员装 React DevTools 扩展后：
 *   - Components 面板看 props/state
 *   - Profiler 录制 → 火焰图找 re-render 元凶
 * "应用 React.memo 修复"按钮切换到 memo 版本
 */

import { createContext, memo, useState } from 'react';
import './Scenario.css';

const TickContext = createContext(0);

// [TEACHING_BUG] 重组件没有 React.memo——context 变化时全树 re-render
function HeavyCard({ label }: { label: string }) {
  // 故意做点"贵"的计算（模拟真实场景的渲染开销）
  const fakeHash = Array.from({ length: 200 }, (_, i) => `${label}-${i}`)
    .join('')
    .length;
  return (
    <div className="rdt-card">
      <strong>{label}</strong>
      <span>hash: {fakeHash}</span>
    </div>
  );
}

const MemoHeavyCard = memo(HeavyCard);

export function ReactDevToolsScenario() {
  const [tick, setTick] = useState(0);
  const [fixed, setFixed] = useState(false);

  return (
    <div className="rdt">
      <h3>⚛ React DevTools：找 re-render 元凶</h3>
      <p className="rdt__lead">
        下面 3 张卡片在父组件每次 tick +1 时都会重新渲染（因为没有 memo）。点几次
        "+1" 按钮，用 React DevTools 的 Profiler 录制，看哪个组件渲染最"贵"。
      </p>

      <div className="rdt__tick">tick: {tick}</div>
      <button type="button" className="btn" onClick={() => setTick((t) => t + 1)}>
        手动 +1
      </button>

      <TickContext.Provider value={tick}>
        <div className="rdt__cards">
          {fixed ? (
            <>
              <MemoHeavyCard label="指标A" />
              <MemoHeavyCard label="指标B" />
              <MemoHeavyCard label="指标C" />
            </>
          ) : (
            <>
              <HeavyCard label="指标A" />
              <HeavyCard label="指标B" />
              <HeavyCard label="指标C" />
            </>
          )}
        </div>
      </TickContext.Provider>

      <div className="rdt__fix">
        <button type="button" className="btn btn--primary" disabled={fixed} onClick={() => setFixed(true)}>
          {fixed ? '✓ 已应用 React.memo' : '应用 React.memo 修复'}
        </button>
      </div>

      <p className="rdt__hint">
        1) 装 React DevTools 扩展（Chrome Web Store 搜 "React Developer Tools"）
        2) F12 → 会出现 Components / Profiler 两个新 tab
        3) Profiler → ● 录制 → 等几秒 → 停止 → 看火焰图
      </p>
    </div>
  );
}
