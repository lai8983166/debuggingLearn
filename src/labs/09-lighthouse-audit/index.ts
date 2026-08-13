import type { Lab } from '@/labs/types';
import { LighthouseAuditScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'lighthouse-audit',
    title: 'Lighthouse 体检',
    learningGoal: '学会跑 Lighthouse 综合报告并定位主要扣分项',
    panel: 'Lighthouse',
    difficulty: 2,
    prerequisite: 'comprehensive',
    badgeLabel: '体检主任',
  },
  Scenario: LighthouseAuditScenario,
  guide,
  fixDoc,
};
