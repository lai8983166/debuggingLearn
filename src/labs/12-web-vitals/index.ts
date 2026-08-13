import type { Lab } from '@/labs/types';
import { WebVitalsScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'web-vitals',
    title: 'Web Vitals 三连击',
    learningGoal: '理解并用 Performance + Rendering 定位 LCP / CLS / INP 问题',
    panel: 'Web Vitals',
    difficulty: 3,
    prerequisite: 'mobile-emulation',
    badgeLabel: 'Vitals 焕新师',
  },
  Scenario: WebVitalsScenario,
  guide,
  fixDoc,
};
