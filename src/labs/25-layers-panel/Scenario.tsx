/**
 * Lab 25 — Layers 面板
 *
 * Scenario: 10 个卡片全部带 will-change: transform（滥用），
 * 浏览器为每个卡片创建独立的合成层 → 内存浪费（层爆炸）。
 * 只有一个卡片真的需要动画。
 * 修复按钮移除多余 will-change，只留动画卡片。
 */

import { useState } from 'react';
import './Scenario.css';

export function LayersPanelScenario() {
  const [fixed, setFixed] = useState(false);

  return (
    <div className="lyr">
      <h3>🗂 Layers：GPU 合成层爆炸</h3>
      <p className="lyr__lead">
        下面 10 张卡片全部带 <code>will-change: transform</code>——浏览器会为每张创建
        独立合成层（各自占 GPU 内存）。只有 1 张真的在动。 Layers 面板能看到所有层。
      </p>

      <div className={`lyr__grid ${fixed ? 'lyr__grid--fixed' : ''}`}>
        <div className="lyr-card lyr-card--anim">动画卡片 ✨</div>
        {Array.from({ length: 9 }, (_, i) => (
          // [TEACHING_BUG] 静态卡片也带 will-change → 层爆炸
          <div key={i} className="lyr-card">
            静态 {i + 1}
          </div>
        ))}
      </div>

      <div className="lyr__fix">
        <button type="button" className="btn btn--primary" disabled={fixed} onClick={() => setFixed(true)}>
          {fixed ? '✓ 已移除多余 will-change' : '应用修复（只留动画卡片的 will-change）'}
        </button>
      </div>

      <p className="lyr__hint">
        打开 Layers：Cmd/Ctrl+Shift+P → "Show Layers"。左侧列出所有合成层；右侧 3D
        视图（可拖动旋转）。修复前应该看到 ~10 层；修复后只剩 1-2 层。
      </p>
    </div>
  );
}
