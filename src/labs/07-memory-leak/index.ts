import type { Lab } from '@/labs/types';
import { MemoryLeakScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'memory-leak',
    title: '越来越卡的页面',
    learningGoal: '学会用 Memory 面板拍快照、对比增长、查 Retainers',
    panel: 'Memory',
    difficulty: 3,
    prerequisite: 'performance-jank',
    badgeLabel: 'Memory 探长',
  },
  Scenario: MemoryLeakScenario,
  guide,
  fixDoc,
};
