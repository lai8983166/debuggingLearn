import type { Lab } from '@/labs/types';
import { SourcesBreakpointScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'sources-breakpoint',
    title: '翻倍的购物车',
    learningGoal: '学会用 Sources 面板设断点、看变量值、单步执行',
    panel: 'Sources',
    difficulty: 2,
    prerequisite: 'elements-dom',
    badgeLabel: 'Sources 侦探',
  },
  Scenario: SourcesBreakpointScenario,
  guide,
  fixDoc,
};
