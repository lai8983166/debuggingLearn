/**
 * Lab 17 — Source Maps
 *
 * Scenario: 在页面注入一段"minified" JS（实际上就是手写一行难读的），
 * 故意让学员在 DevTools Sources 里看到原代码（通过人造 .map）。
 *
 * 因为浏览器不暴露"学员是否启用了 source maps"，用页面侧的"应用 source map"按钮
 * 模拟效果——按钮触发后，页面显示"原代码"。
 */

import { useState } from 'react';
import './Scenario.css';

// [TEACHING_BUG] 故意 minify 风格 + 模拟 sourceMappingURL 注释
const minifiedCode = `function calculateTotal(a,b){let c=0;for(let i=0;i<b.length;i++){c+=b[i].price*b[i].qty}return c}
//# sourceMappingURL=/mock-source-map.js.map`;

const originalCode = `function calculateTotal(name: string, items: CartItem[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.qty;
  }
  return total;
}`;

export function SourceMapsScenario() {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="sm-lab">
      <h3>🗺 Source Maps 修复</h3>
      <p className="sm-lab__lead">
        生产环境部署的 JS 都是 minify 后的——变量名是 <code>a, b, c</code>，没有空格。
        Console 报错指向 <code>calculateTotal</code> 的某行，但你看到的源码根本无法阅读。
        Source Maps 让 DevTools 自动还原原始代码。
      </p>

      <div className="sm-lab__code-block">
        <div className="sm-lab__code-head">
          <span>bundle.min.js（线上产物）</span>
          {!showOriginal && (
            <button type="button" className="btn btn--primary" onClick={() => setShowOriginal(true)}>
              应用 Source Map（模拟）
            </button>
          )}
          {showOriginal && <span className="sm-lab__tag-ok">✓ source map 已加载</span>}
        </div>
        <pre className="sm-lab__pre">
          <code>{showOriginal ? originalCode : minifiedCode}</code>
        </pre>
      </div>

      <p className="sm-lab__hint">
        打开 Console（或 Sources 面板），找到 <code>calculateTotal</code>。
        如果看到的还是 minify 版本，去 DevTools Settings → Sources → 勾选 "Enable JavaScript source maps"。
      </p>
    </div>
  );
}
