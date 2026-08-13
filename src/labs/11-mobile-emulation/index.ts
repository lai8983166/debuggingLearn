import type { Lab } from '@/labs/types';
import { MobileEmulationScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'mobile-emulation',
    title: '移动端水土不服',
    learningGoal: '学会 Device Mode 移动模拟 + Network throttling 排查响应式与加载问题',
    panel: 'Device Mode',
    difficulty: 2,
    prerequisite: 'coverage-unused-code',
    badgeLabel: '移动先行',
  },
  Scenario: MobileEmulationScenario,
  guide,
  fixDoc,
};
