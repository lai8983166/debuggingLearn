import type { Lab } from '@/labs/types';
import { ServiceWorkerScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'service-worker-offline',
    title: '卡住的旧版本',
    learningGoal: '学会用 Application 排查 Service Worker + Cache Storage 策略 bug',
    panel: 'Service Worker',
    difficulty: 3,
    prerequisite: 'command-menu-snippets',
    badgeLabel: '离线工程师',
  },
  Scenario: ServiceWorkerScenario,
  guide,
  fixDoc,
};
