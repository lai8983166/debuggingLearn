import type { Lab } from '@/labs/types';
import { CoverageUnusedCodeScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'coverage-unused-code',
    title: 'Bundle 瘦身',
    learningGoal: '学会用 Coverage 面板定位首屏未使用的 JS/CSS',
    panel: 'Coverage',
    difficulty: 2,
    prerequisite: 'lighthouse-audit',
    badgeLabel: '瘦身教练',
  },
  Scenario: CoverageUnusedCodeScenario,
  guide,
  fixDoc,
};
