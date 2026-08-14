import type { Lab } from '@/labs/types';
import { AiAssistedDebuggingScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'ai-assisted-debugging',
    title: 'AI 协作调试（结业）',
    learningGoal: '学会写结构化调试 prompt 并把 AI 回答当假设用 DevTools 验证',
    panel: 'Comprehensive',
    difficulty: 2,
    prerequisite: 'remote-debugging',
    badgeLabel: 'AI 搭档',
  },
  Scenario: AiAssistedDebuggingScenario,
  guide,
  fixDoc,
};
