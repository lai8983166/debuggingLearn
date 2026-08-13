import type { Lab } from '@/labs/types';
import { PerformanceJankScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'performance-jank',
    title: '卡顿的动画',
    learningGoal: '学会用 Performance 面板录制、看火焰图、定位瓶颈函数',
    panel: 'Performance',
    difficulty: 3,
    prerequisite: 'application-storage',
    badgeLabel: 'Performance 调音师',
  },
  Scenario: PerformanceJankScenario,
  guide,
  fixDoc,
};
