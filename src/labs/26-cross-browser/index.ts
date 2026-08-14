import type { Lab } from '@/labs/types';
import { CrossBrowserScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'cross-browser',
    title: '三大浏览器',
    learningGoal: '掌握 Chrome/Safari/Firefox DevTools 的面板对照与各家独有功能',
    panel: 'Comprehensive',
    difficulty: 2,
    prerequisite: 'layers-panel',
    badgeLabel: '跨浏览器大使',
  },
  Scenario: CrossBrowserScenario,
  guide,
  fixDoc,
};
