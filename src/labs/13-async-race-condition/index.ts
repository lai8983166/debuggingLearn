import type { Lab } from '@/labs/types';
import { AsyncRaceScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'async-race-condition',
    title: '异步竞态：被覆盖的请求',
    learningGoal: '理解异步竞态并用 Sources 异步堆栈 + AbortController 排查',
    panel: 'Async',
    difficulty: 3,
    prerequisite: 'web-vitals',
    badgeLabel: '竞态终结者',
  },
  Scenario: AsyncRaceScenario,
  guide,
  fixDoc,
};
