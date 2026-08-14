import type { Lab } from '@/labs/types';
import { RemoteDebuggingScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'remote-debugging',
    title: '真机调试',
    learningGoal: '掌握 chrome://inspect / iOS Safari / WebView / Node 的远程调试流程',
    panel: 'Comprehensive',
    difficulty: 2,
    prerequisite: 'cross-browser',
    badgeLabel: '真机连线员',
  },
  Scenario: RemoteDebuggingScenario,
  guide,
  fixDoc,
};
