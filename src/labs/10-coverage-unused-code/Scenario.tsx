/**
 * Lab 10 — Coverage 死代码分析
 *
 * Scenario: 首屏只有一个"问候"按钮，但内联了 50KB+ 的 JS（一个大数组 + 多个
 * 未使用的工具函数）。学员用 Coverage 面板启动 instrumentation，刷新页面，
 * 看到首屏 JS 只有约 5% 被执行。
 */

import { useState } from 'react';
import './Scenario.css';

// [TEACHING_BUG] 50KB+ 的未使用代码——首屏只用到了 sayHi
// prettier-ignore
const BIG_UNUSED_ARRAY = Array.from({ length: 5000 }, (_, i) =>
  `entry-${i}-${Math.random().toString(36).slice(2)}-padding-padding-padding`
);

// [TEACHING_BUG] 一堆定义但首屏从未调用的工具函数
export const unusedUtils = {
  formatPrice(n: number) { return `¥${n.toFixed(2)}`; },
  parseQuery(url: string) { return new URL(url).searchParams; },
  debounce<T extends (...a: unknown[]) => void>(fn: T, ms: number) {
    let h: number | undefined;
    return (...args: Parameters<T>) => {
      window.clearTimeout(h);
      h = window.setTimeout(() => fn(...args), ms);
    };
  },
  chunk<T>(arr: T[], size: number): T[][] {
    return arr.reduce((acc, item, i) => {
      if (i % size === 0) acc.push([]);
      acc[acc.length - 1].push(item);
      return acc;
    }, [] as T[][]);
  },
  // 故意引用 BIG_UNUSED_ARRAY 让它被 tree-shake 掉的可能性降低
  getSize() { return BIG_UNUSED_ARRAY.length; },
};

export function CoverageUnusedCodeScenario() {
  const [greeting, setGreeting] = useState<string | null>(null);

  const sayHi = () => {
    // 这是首屏唯一会执行的函数
    setGreeting(`Hi @ ${new Date().toLocaleTimeString()}`);
  };

  return (
    <div className="cov">
      <h3>👋 问候小工具</h3>
      <p className="cov__lead">
        这个页面看似简单——就一个按钮。但打包后体积很大。用 Coverage 面板看看为什么。
      </p>
      <button type="button" className="btn btn--primary" onClick={sayHi}>
        打招呼
      </button>
      {greeting && <p className="cov__out">{greeting}</p>}

      {/* [TEACHING_BUG] 暴露未用代码到全局，避免被 tree-shake，且让 Coverage 能看到 */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          // 引用一下确保打包器保留
          // eslint-disable-next-line no-console
          console.log('[debug] bundle size check', unusedUtils.getSize());
        }}
        className="cov__hidden-link"
      >
        （隐藏的调试链接）
      </a>

      <p className="cov__hint">
        打开 Command Menu（Cmd/Ctrl+Shift+P）→ 搜 "Show Coverage" → 点 reload 图标开始记录
        → 刷新页面 → 看 Unused Bytes 列。
      </p>
    </div>
  );
}
