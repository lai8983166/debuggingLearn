import type { LabGuideConfig } from '@/labs/types';
import { REQUIRED_DONE_FOR_PASS } from './Scenario';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '⚡',
      message: '这关没 bug——目标是让你熟悉 10 个高效 DevTools 操作。完成 9 个即可通关。',
    },
    {
      emoji: '⌨️',
      message: '两个最重要的快捷键：Cmd/Ctrl+K（Command Menu 全局搜索）和 Cmd/Ctrl+Shift+P（跑命令）。',
    },
    {
      emoji: '📋',
      message: 'Sources → Snippets 是你的"DevTools 内代码片段库"。常存一些调试脚本（如打印 cookie、格式化 JSON）随时复用。',
    },
  ],
  steps: [
    {
      title: 'Command Menu 三剑客',
      body: 'Cmd+K（DevTools 全局搜索）/ Cmd+P（跳文件）/ Cmd+Shift+P（跑命令）。三个都很常用。',
      devToolsScreenshot: 'command-menu-overview',
    },
    {
      title: 'Console Drawer',
      body: 'Esc 在任意 tab 下打开/关闭 Console drawer——不用切回 Console tab，下方直接出来。',
      devToolsScreenshot: 'console-drawer',
    },
    {
      title: 'Sources 跳行号',
      body: 'Sources 里 Cmd+G 输入行号直跳。配合 Cmd+P 跳文件，几乎可以秒定位任何代码位置。',
      devToolsScreenshot: 'go-to-line',
    },
    {
      title: 'Dock 切换',
      body: 'Cmd+Shift+D 循环切换 DevTools 停靠位置（右 / 下 / 左 / 独立窗口）。双屏特别有用。',
    },
    {
      title: '创建 Snippet',
      body: 'Sources 左侧 Snippets → + New snippet。粘代码、命名、Cmd+Enter 运行。常用于调试：打印 store、格式化 JSON、操作 DOM。',
      devToolsScreenshot: 'snippets-create',
    },
    {
      title: '运行 Snippet 触发自动检测',
      body: '在新 snippet 里粘贴 `window.__task_snippet_run = true;` 然后 Run。本关页面会自动检测到这个全局变量。',
      devToolsScreenshot: 'snippet-run',
    },
    {
      title: 'Performance Monitor',
      body: 'Cmd+Shift+P → "Show Performance monitor"。实时显示 CPU / JS heap / DOM 节点数等，比 Performance 录制轻量。',
    },
    {
      title: '完成 9 / 10 即通关',
      body: '其他 9 个任务靠"我做完了"按钮自报完成。诚实点——通关徽章叫"效率达人"。',
    },
  ],
  hints: [
    { text: '最常用的两个：Cmd+K 全局搜，Cmd+Shift+P 跑命令。' },
    { text: 'Sources → Snippets 可以存调试代码片段。' },
    { text: `完成 ${REQUIRED_DONE_FOR_PASS}/10 个任务即可通关。` },
  ],
  validate: () => {
    // 主动型：数已完成的任务条目（DOM 上的 .cm__item--done 数量）
    const doneItems = document.querySelectorAll('.cm__item--done');
    const count = doneItems.length;
    if (count >= REQUIRED_DONE_FOR_PASS) {
      return { passed: true, feedback: '' };
    }
    return {
      passed: false,
      feedback: `当前完成 ${count} / 10，至少需要 ${REQUIRED_DONE_FOR_PASS} 个才能通关。`,
    };
  },
};
