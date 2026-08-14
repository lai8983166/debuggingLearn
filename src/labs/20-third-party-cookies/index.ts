import type { Lab } from '@/labs/types';
import { ThirdPartyCookiesScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'third-party-cookies',
    title: '消失的 Cookie',
    learningGoal: '理解 SameSite 三档与第三方 cookie 限制',
    panel: 'Application',
    difficulty: 1,
    prerequisite: 'cors-errors',
    badgeLabel: 'Cookie 法务',
  },
  Scenario: ThirdPartyCookiesScenario,
  guide,
  fixDoc,
};
