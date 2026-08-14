import type { Lab } from '@/labs/types';
import { RenderingPanelScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'rendering-panel',
    title: '抖动的页面',
    learningGoal: '学会用 Rendering 面板可视化 Layout Shift 和重绘',
    panel: 'Rendering',
    difficulty: 2,
    prerequisite: 'third-party-cookies',
    badgeLabel: '抖动终结者',
  },
  Scenario: RenderingPanelScenario,
  guide,
  fixDoc,
};
