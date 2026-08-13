/**
 * Lab 3 — Sources 断点调试
 *
 * Scenario: 一个购物车，商品 50 元 x 2 件 = 期望 100 元，但购物车显示 200 元。
 * 学习者需要打开 Sources 面板，在 computeTotal 上设断点，看变量值。
 */

import { useMemo, useState } from 'react';
import './Scenario.css';

interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  qty: number;
}

const items: CartItem[] = [
  { id: 1, name: 'T 恤', unitPrice: 50, qty: 2 },
  { id: 2, name: '帽子', unitPrice: 30, qty: 1 },
];

function computeTotal(cart: CartItem[]): number {
  let total = 0;
  for (const item of cart) {
    // [TEACHING_BUG] 这里多乘了 2，让总价翻倍
    total += item.unitPrice * item.qty * 2;
  }
  return total;
}

export function SourcesBreakpointScenario() {
  const [cart] = useState<CartItem[]>(items);
  const [debugValue, setDebugValue] = useState<string>('还没调试');

  // 给学员一个"在页面上能看到"的入口，便于反思型验证
  const total = useMemo(() => computeTotal(cart), [cart]);

  const handleShowExpected = () => {
    // 期望计算（不含 bug）
    const expected = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
    setDebugValue(`期望：${expected}，实际显示：${total}`);
  };

  return (
    <div className="cart">
      <h3>🛒 购物车</h3>
      <ul className="cart__list">
        {cart.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>
              ¥{item.unitPrice} × {item.qty}
            </span>
          </li>
        ))}
      </ul>
      <div className="cart__total" data-testid="cart-total">
        合计：<strong>¥{total}</strong>
      </div>
      <button type="button" className="cart__btn" onClick={handleShowExpected}>
        显示期望金额
      </button>
      <p className="cart__debug">{debugValue}</p>
      <p className="cart__hint">
        T 恤 50 × 2 = 100，帽子 30 × 1 = 30，期望合计 130。但页面显示了别的数。
        打开 Sources 面板，找到 computeTotal 函数，在 <code>total += ...</code> 那一行打个断点。
      </p>
    </div>
  );
}
