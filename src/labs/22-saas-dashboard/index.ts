import type { Lab } from '@/labs/types';
import { SaasDashboardScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'saas-dashboard',
    title: 'SaaS 救火',
    learningGoal: '综合运用多个 DevTools 面板诊断真实项目的混合 bug',
    panel: 'Comprehensive',
    difficulty: 3,
    prerequisite: 'rendering-panel',
    badgeLabel: 'SaaS 救火队长',
  },
  Scenario: SaasDashboardScenario,
  guide,
  fixDoc,
};
