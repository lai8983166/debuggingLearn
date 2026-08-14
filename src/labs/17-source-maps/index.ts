import type { Lab } from '@/labs/types';
import { SourceMapsScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'source-maps',
    title: '解开 Minify',
    learningGoal: '学会启用 Source Maps 在 DevTools 里看原始 TypeScript',
    panel: 'Sources',
    difficulty: 1,
    prerequisite: 'service-worker-offline',
    badgeLabel: '解压缩师',
  },
  Scenario: SourceMapsScenario,
  guide,
  fixDoc,
};
