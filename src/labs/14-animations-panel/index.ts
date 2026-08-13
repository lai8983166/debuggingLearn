import type { Lab } from '@/labs/types';
import { AnimationsPanelScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'animations-panel',
    title: '机械的动画',
    learningGoal: '学会用 Animations 面板的时间线视图调试 CSS keyframes',
    panel: 'Animations',
    difficulty: 2,
    prerequisite: 'async-race-condition',
    badgeLabel: '动效调音师',
  },
  Scenario: AnimationsPanelScenario,
  guide,
  fixDoc,
};
