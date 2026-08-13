/**
 * Lab 11 — Mobile 模拟 + 网络限速
 *
 * Scenario: 一个产品网格。CSS 用了 !important 在 @media (min-width: 768px)
 * 上声明 grid-template-columns: repeat(3, 1fr) ——这个 !important 在窄屏
 * 也覆盖了应有的单列样式。慢图加载在 Slow 3G 下尤其明显。
 *
 * DevTools Device Mode（移动模拟 + 触摸事件）和 Network throttling 都是
 * 浏览器内置能力，无法从页面 JS 自动触发。本关用反思型验证。
 */

import './Scenario.css';

const products = [
  { id: 1, name: '小红书 A', price: 19 },
  { id: 2, name: '小红书 B', price: 29 },
  { id: 3, name: '小红书 C', price: 39 },
  { id: 4, name: '小红书 D', price: 49 },
];

export function MobileEmulationScenario() {
  return (
    <div className="mob">
      <h3>📚 商品网格</h3>
      <p className="mob__lead">
        桌面下看着没问题。把窗口拉窄或用 Device Mode 切到 iPhone——会看到布局"卡住"不变成单列。
      </p>
      <ul className="mob__grid" data-testid="product-grid">
        {products.map((p) => (
          // [TEACHING_BUG] 图无尺寸 + 无 lazy，移动端加载慢
          <li key={p.id} className="mob__card">
            <img src={`https://picsum.photos/200/200?random=${p.id}`} />
            <h4>{p.name}</h4>
            <span>¥{p.price}</span>
          </li>
        ))}
      </ul>
      <p className="mob__hint">
        切换到 iPhone 12 + Slow 3G，刷新页面。观察（a）布局是否变单列 （b）首屏图片加载时间。
      </p>
    </div>
  );
}
