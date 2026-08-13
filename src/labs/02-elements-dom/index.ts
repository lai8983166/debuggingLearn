import type { Lab } from '@/labs/types';
import { ElementsDomScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'elements-dom',
    title: '乱序的卡片',
    learningGoal: '学会用 Elements 面板检查 DOM 结构与 computed 样式',
    panel: 'Elements',
    difficulty: 1,
    prerequisite: 'console-errors',
    badgeLabel: 'Elements 园丁',
  },
  Scenario: ElementsDomScenario,
  guide,
  fixDoc,
};
