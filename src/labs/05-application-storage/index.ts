import type { Lab } from '@/labs/types';
import { ApplicationStorageScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'application-storage',
    title: '消失的登录态',
    learningGoal: '学会用 Application 面板检查 Local Storage / Cookies / IndexedDB',
    panel: 'Application',
    difficulty: 2,
    prerequisite: 'network-failing-api',
    badgeLabel: 'Application 守门人',
  },
  Scenario: ApplicationStorageScenario,
  guide,
  fixDoc,
};
