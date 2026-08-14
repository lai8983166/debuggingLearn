/**
 * Lab 22 — SaaS Dashboard（综合关）
 *
 * 一个虚构的 "BuggyAnalytics" 仪表盘，同时埋 5 个混合 bug：
 *   1. DOM 错乱（卡片 flex:1 但容器没设宽度）
 *   2. 内存泄漏（图表 mount 时空 cleanup）
 *   3. API 失败（/api/metrics 500 被吞）
 *   4. a11y（对比度 1.5:1 + 缺 aria-label）
 *   5. 视觉抖动（refresh force reflow）
 *
 * 5 个修复按钮 + 模块级 phase 计数器。
 */

import { useEffect, useRef, useState } from 'react';
import './Scenario.css';

// 模块级"泄漏池"（模拟内存泄漏）
const leakPool: number[] = [];

let phase = 0;
export function _resetPhase() {
  phase = 0;
}

interface FixState {
  dom: boolean;
  memory: boolean;
  api: boolean;
  a11y: boolean;
  repaint: boolean;
}

const initialFix: FixState = {
  dom: false,
  memory: false,
  api: false,
  a11y: false,
  repaint: false,
};

export function SaasDashboardScenario() {
  const [fix, setFix] = useState<FixState>(initialFix);
  const [metrics, setMetrics] = useState<number[] | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // [TEACHING_BUG] 图表 mount 时注册 interval 但 cleanup 是空的
  useEffect(() => {
    // 模拟 fetch metrics（这里假装失败）
    fetch('/api/metrics')
      .then((r) => r.json())
      // [TEACHING_BUG] res.ok 没检查，500 也进 then
      .then((data) => setMetrics(data.metrics))
      .catch(() => {
        // [TEACHING_BUG] 静默吞掉
      });

    intervalRef.current = window.setInterval(() => {
      // [TEACHING_BUG] 每次 interval 往 leakPool push，永远不释放
      for (let i = 0; i < 100; i++) leakPool.push(Math.random());
    }, 1000);

    return () => {
      // [TEACHING_BUG] 故意啥也不清理
      // 应该 clearInterval(intervalRef.current!)
    };
  }, []);

  // [TEACHING_BUG] refresh 触发 force reflow（offsetHeight + toggle class）
  const handleRefresh = () => {
    // 故意多次读取 layout 属性触发 reflow
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight;
    }
    setRefreshCount((c) => c + 1);
  };

  const applyFix = (key: keyof FixState) => {
    setFix((prev) => ({ ...prev, [key]: true }));
    if (key === 'memory' && intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
  };

  const allFixed = Object.values(fix).every(Boolean);

  return (
    <div className="saas">
      <header className="saas__header">
        <h3>📊 BuggyAnalytics</h3>
        <button type="button" className="btn" onClick={handleRefresh}>
          Refresh（{refreshCount}）
        </button>
      </header>

      <section className={`saas__grid ${fix.dom ? 'saas__grid--fixed' : ''}`}>
        <div className="saas__card">
          <h4>用户数</h4>
          {/* [TEACHING_BUG] 对比度 1.5:1 - 灰字灰底 */}
          <div className={`saas__metric ${fix.a11y ? 'saas__metric--fixed' : ''}`}>
            {metrics ? metrics[0] : '—'}
          </div>
        </div>
        <div className="saas__card">
          <h4>订单</h4>
          <div className={`saas__metric ${fix.a11y ? 'saas__metric--fixed' : ''}`}>
            {metrics ? metrics[1] : '—'}
          </div>
        </div>
        <div className="saas__card">
          <h4>收入</h4>
          {/* [TEACHING_BUG] 图标按钮缺 aria-label */}
          <button type="button" className="saas__icon-btn" aria-label={fix.a11y ? '更多信息' : undefined}>
            ?
          </button>
        </div>
      </section>

      {metrics === null && (
        <p className="saas__empty">数据加载中…（可能永远不会成功）</p>
      )}

      <div className="saas__actions">
        <div className="saas__action">
          <span>1. DOM 错乱（flex 容器）</span>
          <button type="button" className="btn" disabled={fix.dom} onClick={() => applyFix('dom')}>
            {fix.dom ? '✓' : '修复'}
          </button>
        </div>
        <div className="saas__action">
          <span>2. 内存泄漏（interval 未清）</span>
          <button type="button" className="btn" disabled={fix.memory} onClick={() => applyFix('memory')}>
            {fix.memory ? '✓' : '修复'}
          </button>
        </div>
        <div className="saas__action">
          <span>3. API 失败（500 被吞）</span>
          <button type="button" className="btn" disabled={fix.api} onClick={() => applyFix('api')}>
            {fix.api ? '✓' : '修复'}
          </button>
        </div>
        <div className="saas__action">
          <span>4. a11y（对比度 + aria）</span>
          <button type="button" className="btn" disabled={fix.a11y} onClick={() => applyFix('a11y')}>
            {fix.a11y ? '✓' : '修复'}
          </button>
        </div>
        <div className="saas__action">
          <span>5. 视觉抖动（force reflow）</span>
          <button type="button" className="btn" disabled={fix.repaint} onClick={() => applyFix('repaint')}>
            {fix.repaint ? '✓' : '修复'}
          </button>
        </div>
      </div>

      {allFixed && (
        <p className="saas__done">
          ✓ 5 个 bug 全部修复。点 LabGuide 的"检查答案"通关。
        </p>
      )}
    </div>
  );
}

// 给 guide.ts 用的验证函数
export function getFixState(): FixState | null {
  // 读 DOM 反推 fix 状态——如果 5 个修复按钮都 disabled，全修了
  const buttons = document.querySelectorAll('.saas__action .btn[disabled]');
  return buttons.length === 5 ? { ...initialFix, dom: true, memory: true, api: true, a11y: true, repaint: true } : null;
}

// 暴露给 guide 的 phase 计数
export function validatePhase(): number {
  const state = getFixState();
  if (!state) return phase;
  // 每次调用推进一阶段
  return phase++;
}
