/**
 * Lab 21 — Rendering 面板
 *
 * Scenario: 一个滚动页面，多处会触发 Layout Shift：
 *   - 图片无 width/height
 *   - 动态 banner 不预留空间
 *   - 字体加载导致文字位移
 *
 * 学员用 Rendering 面板 → "Layout Shift Regions" 看哪些区域在抖。
 * WebVitalsMeter 显示 CLS 高。
 */

import { useEffect, useState } from 'react';
import { WebVitalsMeter } from '@/components/WebVitalsMeter';
import './Scenario.css';

export function RenderingPanelScenario() {
  const [bannerVisible, setBannerVisible] = useState(false);

  // [TEACHING_BUG] 动态 banner 不预留空间，加载完成会推动下方内容
  useEffect(() => {
    const t = window.setTimeout(() => setBannerVisible(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="render-lab">
      <WebVitalsMeter />
      <h3>🎨 Rendering 面板</h3>
      <p className="render-lab__lead">
        本页面会抖。看右上角的 CLS 数字（应该明显大于 0）。Rendering 面板能可视化"哪些区域在抖"。
      </p>

      <div className="render-lab__content">
        {bannerVisible && (
          <div className="render-lab__banner">📢 新功能上线！</div>
        )}

        <h4>产品列表</h4>
        <ul className="render-lab__list">
          {[1, 2, 3, 4, 5].map((i) => (
            // [TEACHING_BUG] 图片无 width/height，加载完成撑开会推动后面内容
            <li key={i}>
              <img src={`https://picsum.photos/60/60?random=${i}`} alt="" />
              <span>商品 {i}</span>
            </li>
          ))}
        </ul>

        <h4>说明文字（用 fallback 字体 → 字体加载后位移）</h4>
        <p className="render-lab__paragraph">
          这段文字初用系统字体渲染，0.5 秒后切换到自定义字体（模拟字体加载），文字宽度变化导致整行位移。
        </p>
      </div>

      <p className="render-lab__hint">
        Cmd/Ctrl+Shift+P → "Show Rendering" → 勾选 "Layout Shift Regions" + "Paint Flashing"。
        重新滚动页面，会看到绿色高亮区域 = 触发重绘的位置；蓝色高亮 = Layout Shift 区域。
      </p>
    </div>
  );
}
