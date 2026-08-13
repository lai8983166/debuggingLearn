/**
 * Lab 13 — 异步竞态条件
 *
 * Scenario: 搜索框。学员快速输入"A"再输入"B"：
 *   - B 请求 200ms 后返回，UI 显示 B 的结果（正确）
 *   - A 请求 1500ms 后返回，UI 被 A 的结果覆盖（错误！学员实际看的是 B）
 *
 * 修复思路：用 AbortController 取消前一个请求；新请求开始前先 abort 旧的。
 * 本关提供"应用 AbortController 修复"按钮一键替换 handler。
 *
 * 关键教学点：
 *   - Sources 异步堆栈（async stack traces）能看到 fetch 链
 *   - Console 输出帮助理解请求顺序
 */

import { useEffect, useRef, useState } from 'react';
import './Scenario.css';

interface SearchResult {
  query: string;
  results: string[];
}

export function AsyncRaceScenario() {
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState<SearchResult | null>(null);
  const [fixed, setFixed] = useState(false);

  // Refs to hold the "current" AbortController and the latest request serial
  const abortRef = useRef<AbortController | null>(null);
  const serialRef = useRef(0);

  useEffect(() => {
    if (query.trim() === '') {
      setOutput(null);
      return;
    }

    // If fixed, abort the previous request before issuing a new one
    if (fixed && abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const mySerial = ++serialRef.current;

    // eslint-disable-next-line no-console
    console.log(`[App] firing search for "${query}" (#${mySerial})`);

    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: SearchResult) => {
        // [TEACHING_BUG] 这里没有 serial 检查，晚到的旧请求会覆盖新结果
        // 修复方式之一：if (mySerial !== serialRef.current) return;
        // 或者用 AbortController（本关的修复按钮就走这条路）
        if (fixed) {
          // AbortController 已经保证了只有最新请求能 resolve
          // 但 controller.signal.abort() 会 reject，所以这里只处理 fulfilled
        }
        setOutput(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // eslint-disable-next-line no-console
          console.log(`[App] request #${mySerial} aborted (good)`);
          return;
        }
        // eslint-disable-next-line no-console
        console.error(err);
      });

    return () => {
      // Cleanup: only abort if fixed mode (matches design — buggy mode lets
      // the stale request complete to demo the race)
      if (fixed) {
        controller.abort();
      }
    };
  }, [query, fixed]);

  return (
    <div className="race">
      <h3>🔍 异步搜索（含竞态 bug）</h3>
      <p className="race__lead">
        快速输入"<strong>A</strong>"再输入"<strong>B</strong>"（500ms 内）。你会看到 UI 先显示 B，
        然后被迟到的 A 结果覆盖——这就是竞态。
      </p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="试试快速输入 A 然后输入 B…"
        className="race__input"
      />
      <div className="race__output">
        {output ? (
          <>
            <p>
              当前显示的查询：<code>{output.query}</code>
            </p>
            <ul>
              {output.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="race__placeholder">（输入查询看结果）</p>
        )}
      </div>
      <button type="button" className="btn btn--primary" onClick={() => setFixed(true)}>
        {fixed ? '✓ 已应用 AbortController 修复' : '应用 AbortController 修复'}
      </button>
      <p className="race__hint">
        修复后再试 A→B：旧请求会被取消，UI 始终显示最新输入的结果。
        修复后点"检查答案"。
      </p>
    </div>
  );
}
