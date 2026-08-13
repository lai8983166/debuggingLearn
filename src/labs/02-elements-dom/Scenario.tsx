/**
 * Lab 2 — Elements DOM/样式排查
 *
 * Scenario: 一个"商品卡片"网格。因为 flex-direction 写错了，
 * 卡片横着挤在一起，且有一个 item 的 key 重复导致 React 复用了错误的 DOM。
 * 学习者需要用 Elements 面板检查 DOM 结构 + computed style。
 */

import './Scenario.css';

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

const products: Product[] = [
  { id: 1, name: '机械键盘', price: 599, img: '⌨️' },
  { id: 2, name: '电竞鼠标', price: 199, img: '🖱️' },
  { id: 3, name: '显示器', price: 1899, img: '🖥️' },
  { id: 4, name: '麦克风', price: 459, img: '🎙️' },
];

export function ElementsDomScenario() {
  return (
    <div>
      <h3>今日热销</h3>
      {/* [TEACHING_BUG] flex-direction 应该是 row，但写成了 column-reverse，且缺少 wrap */}
      <div className="buggy-grid" data-testid="product-grid">
        {products.map((p, i) => (
          // [TEACHING_BUG] key 用了 index 而非稳定的 id，未来增删会出问题
          <article className="product-card" key={i} data-product-id={p.id}>
            <span className="product-card__img">{p.img}</span>
            <h4 className="product-card__name">{p.name}</h4>
            <span className="product-card__price">¥{p.price}</span>
          </article>
        ))}
      </div>
      <p className="elements-dom__hint">
        卡片看起来很奇怪？用 Elements 面板检查 <code>.buggy-grid</code> 的 computed style。
      </p>
    </div>
  );
}
