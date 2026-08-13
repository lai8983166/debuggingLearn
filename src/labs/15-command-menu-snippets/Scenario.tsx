/**
 * Lab 15 — Command Menu + Snippets 效率关
 *
 * 与其他关不同：这关没有 bug，纯任务清单式介绍 DevTools 效率功能。
 *
 * 任务分两类：
 *   - 可观测（如"在 Snippets 运行代码"）：监听 window.__task_* 全局变量
 *   - 不可观测（如"按 Cmd+K 打开菜单"）：反思型问题"你完成了吗？"
 *
 * validate() 返回 passed = 至少 9/10 任务标记完成。
 */

import { useEffect, useState } from 'react';
import './Scenario.css';

interface Task {
  id: string;
  label: string;
  hint: string;
  /** Reflection tasks are confirmed via a "我做完了" button (we can't observe). */
  observable: boolean;
}

const TASKS: Task[] = [
  {
    id: 'cmd-k',
    label: '按 Cmd/Ctrl+K 打开 Command Menu（也叫 DevTools Search）',
    hint: 'Cmd+K（Mac）/ Ctrl+K（Win/Linux）。',
    observable: false,
  },
  {
    id: 'cmd-p',
    label: '用 Cmd/Ctrl+P 跳到任意源文件',
    hint: 'Cmd+P，输入文件名片段（如 "registry"）。',
    observable: false,
  },
  {
    id: 'cmd-shift-p',
    label: '用 Cmd/Ctrl+Shift+P 跑命令（如 "Show Coverage"）',
    hint: 'Cmd+Shift+P 输入命令名。',
    observable: false,
  },
  {
    id: 'drawer',
    label: '打开 Console Drawer（按 Esc）',
    hint: 'DevTools 任意 tab 下按 Esc。',
    observable: false,
  },
  {
    id: 'go-to-line',
    label: '在 Sources 用 Cmd/Ctrl+G 跳到指定行号',
    hint: '打开 Sources，按 Cmd+G，输入数字。',
    observable: false,
  },
  {
    id: 'dock-right',
    label: '把 DevTools 停靠到右侧（Dock side 切换）',
    hint: 'Cmd+Shift+D 循环切换 dock 位置。',
    observable: false,
  },
  {
    id: 'theme',
    label: '切换 DevTools 主题（明/暗）',
    hint: 'Cmd+Shift+P → "theme"。',
    observable: false,
  },
  {
    id: 'snippet-create',
    label: '在 Sources → Snippets 创建一个新 snippet，命名为 demo',
    hint: 'Sources → 左侧栏 Snippets → + New snippet。',
    observable: false,
  },
  {
    id: 'snippet-run',
    label: '在 snippet 里粘贴并运行：window.__task_snippet_run = true',
    hint: '粘进代码后点 ▶ Run（或 Cmd+Enter）。',
    observable: true,
  },
  {
    id: 'perf-monitor',
    label: '打开 Performance Monitor（实时 CPU / 内存）',
    hint: 'Cmd+Shift+P → "Show Performance monitor"。',
    observable: false,
  },
];

export function CommandMenuScenario() {
  // Tasks 0/1 — observable via window.__task_*
  const [snippetRunDone, setSnippetRunDone] = useState(false);
  // Reflection-confirmed task ids
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  // Listen for the snippet-run observable
  useEffect(() => {
    const check = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.__task_snippet_run === true) {
        setSnippetRunDone(true);
      }
    };
    const interval = window.setInterval(check, 500);
    check();
    return () => window.clearInterval(interval);
  }, []);

  const isTaskDone = (id: string) => {
    if (id === 'snippet-run') return snippetRunDone;
    return confirmed.has(id);
  };

  const toggleConfirmed = (id: string) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doneCount = TASKS.filter((t) => isTaskDone(t.id)).length;

  return (
    <div className="cm">
      <h3>⚡ 效率关：Command Menu + Snippets</h3>
      <p className="cm__lead">
        本关没 bug——目标只是让你熟悉 10 个超有用的 DevTools 操作。完成 9 个或以上即可通关。
      </p>

      <div className="cm__progress">
        进度：<strong>{doneCount}</strong> / {TASKS.length}
      </div>

      <ul className="cm__list">
        {TASKS.map((task) => {
          const done = isTaskDone(task.id);
          return (
            <li
              key={task.id}
              className={`cm__item ${done ? 'cm__item--done' : ''}`}
              data-testid={`task-${task.id}`}
            >
              <div className="cm__item-head">
                <span className="cm__check">{done ? '✓' : '○'}</span>
                <span className="cm__label">{task.label}</span>
              </div>
              <div className="cm__item-hint">💡 {task.hint}</div>
              {!task.observable && !done && (
                <button
                  type="button"
                  className="btn btn--ghost cm__confirm"
                  onClick={() => toggleConfirmed(task.id)}
                >
                  我做完了
                </button>
              )}
              {!task.observable && done && (
                <button
                  type="button"
                  className="btn btn--ghost cm__confirm"
                  onClick={() => toggleConfirmed(task.id)}
                >
                  撤销
                </button>
              )}
              {task.observable && (
                <em className="cm__observable">
                  {done ? '✓ 已检测到' : '（自动检测中…）'}
                </em>
              )}
            </li>
          );
        })}
      </ul>

      <p className="cm__hint">
        提示：在 Sources → Snippets 里运行这段代码即可触发自动检测：
        <code>window.__task_snippet_run = true;</code>
      </p>
    </div>
  );
}

// Export task list so validate() can reference expected count if needed
export const REQUIRED_DONE_FOR_PASS = 9;
