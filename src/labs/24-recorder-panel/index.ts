import type { Lab } from '@/labs/types';
import { RecorderPanelScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'recorder-panel',
    title: '录制与回放',
    learningGoal: '学会用 Recorder 面板录制 UI 流程、回放验证、导出 E2E 脚本',
    panel: 'Command Menu',
    difficulty: 2,
    prerequisite: 'react-devtools',
    badgeLabel: '流程导演',
  },
  Scenario: RecorderPanelScenario,
  guide,
  fixDoc,
};
