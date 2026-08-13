import type { Lab } from '@/labs/types';
import { ComprehensiveScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'comprehensive',
    title: '结业：失败的提交',
    learningGoal: '综合运用 Console + Network + Sources 三面板定位复杂 bug',
    panel: 'Comprehensive',
    difficulty: 3,
    prerequisite: 'memory-leak',
    badgeLabel: '结业调试大师',
  },
  Scenario: ComprehensiveScenario,
  guide,
  fixDoc,
};
