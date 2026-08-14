import type { Lab } from '@/labs/types';
import { ReactDevToolsScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'react-devtools',
    title: '谁在重渲染',
    learningGoal: '学会用 React DevTools 的 Components/Profiler 找 re-render 元凶',
    panel: 'Sources',
    difficulty: 2,
    prerequisite: 'saas-dashboard',
    badgeLabel: 'React 侦察兵',
  },
  Scenario: ReactDevToolsScenario,
  guide,
  fixDoc,
};
