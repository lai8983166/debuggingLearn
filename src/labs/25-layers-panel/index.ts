import type { Lab } from '@/labs/types';
import { LayersPanelScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'layers-panel',
    title: '层爆炸',
    learningGoal: '学会用 Layers 面板查 GPU 合成层与 will-change 滥用',
    panel: 'Rendering',
    difficulty: 2,
    prerequisite: 'recorder-panel',
    badgeLabel: '合成层管理员',
  },
  Scenario: LayersPanelScenario,
  guide,
  fixDoc,
};
