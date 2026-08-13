/**
 * Lab 14 — Animations 面板
 *
 * Scenario: 三个动画都用 `linear` easing，看起来机械、没生气。
 * 修复后改用 cubic-bezier（如 ease-out）会让动画"自然"。
 *
 * 与 v1 Performance 关卡的区别：那里聚焦"找性能瓶颈函数"，
 * 这里聚焦"用 Animations 面板的时间线视图调试 CSS keyframes"。
 */

import { useEffect, useState } from 'react';
import './Scenario.css';

export function AnimationsPanelScenario() {
  const [fixed, setFixed] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  // 用 key 重挂载触发动画重启
  const rerun = () => setSpinKey((k) => k + 1);

  // 注入修复后的样式（替换 easing）
  useEffect(() => {
    if (!fixed) return;
    const style = document.createElement('style');
    style.setAttribute('data-animations-fix', 'true');
    // [TEACHING_BUG 的反例] 修复后的 easing 用 cubic-bezier
    style.textContent = `
      .anim-spin { animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .anim-hover { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
      .anim-fill { animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [fixed]);

  return (
    <div className="ani">
      <h3>🎨 动画时间线</h3>
      <p className="ani__lead">
        三个动画现在用 <code>linear</code> 缓动——看起来很机械。修复后换成 <code>cubic-bezier</code> 会自然很多。
      </p>

      <section className="ani__group">
        <div className="ani__label">旋转加载</div>
        <div key={spinKey} className="anim-spin">🔄</div>
      </section>

      <section className="ani__group">
        <div className="ani__label">悬停缩放</div>
        <div className="anim-hover">👆</div>
      </section>

      <section className="ani__group">
        <div className="ani__label">进度填充</div>
        <div className="anim-fill-track">
          {/* [TEACHING_BUG] linear 让填充像匀速机器人 */}
          <div className="anim-fill" />
        </div>
      </section>

      <div className="ani__actions">
        <button type="button" className="btn" onClick={rerun}>
          重新触发动画
        </button>
        <button type="button" className="btn btn--primary" onClick={() => setFixed(true)}>
          {fixed ? '✓ 已应用 cubic-bezier 修复' : '应用 cubic-bezier 修复'}
        </button>
      </div>

      <p className="ani__hint">
        打开 Animations 面板（More tools → Animations），点上面的元素，看时间线 + easing 字段。
      </p>
    </div>
  );
}
