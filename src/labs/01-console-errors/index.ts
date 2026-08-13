import type { Lab } from '@/labs/types';
import { ConsoleErrorsScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'console-errors',
    title: '消失的点击',
    learningGoal: '学会用 Console 面板定位运行时错误',
    panel: 'Console',
    difficulty: 1,
    prerequisite: null,
    badgeLabel: 'Console 侦探',
  },
  Scenario: ConsoleErrorsScenario,
  guide,
  fixDoc,
};
