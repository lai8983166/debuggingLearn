import type { Lab } from '@/labs/types';
import { NetworkFailingApiScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'network-failing-api',
    title: '安静的文章列表',
    learningGoal: '学会用 Network 面板观察请求状态码与响应内容',
    panel: 'Network',
    difficulty: 2,
    prerequisite: 'sources-breakpoint',
    badgeLabel: 'Network 猎人',
  },
  Scenario: NetworkFailingApiScenario,
  guide,
  fixDoc,
};
