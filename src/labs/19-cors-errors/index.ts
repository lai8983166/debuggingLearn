import type { Lab } from '@/labs/types';
import { CorsErrorsScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'cors-errors',
    title: '跨域外交',
    learningGoal: '学会读 Console + Network 的 CORS 错误并理解 Access-Control 头',
    panel: 'Network',
    difficulty: 1,
    prerequisite: 'websocket-debug',
    badgeLabel: '跨域外交官',
  },
  Scenario: CorsErrorsScenario,
  guide,
  fixDoc,
};
