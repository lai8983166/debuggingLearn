import type { Lab } from '@/labs/types';
import { WebsocketDebugScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'websocket-debug',
    title: '安静的消息流',
    learningGoal: '学会用 Network 面板的 WS 子分类调试 WebSocket',
    panel: 'Network',
    difficulty: 1,
    prerequisite: 'source-maps',
    badgeLabel: '实时观察员',
  },
  Scenario: WebsocketDebugScenario,
  guide,
  fixDoc,
};
