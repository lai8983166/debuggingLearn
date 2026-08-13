import type { Lab } from '@/labs/types';
import { CommandMenuScenario } from './Scenario';
import { guide } from './guide';
import fixDoc from './FIX.md?raw';

export const lab: Lab = {
  meta: {
    slug: 'command-menu-snippets',
    title: '效率关：Command Menu 与 Snippets',
    learningGoal: '熟悉 DevTools 高效快捷键，学会用 Snippets 存调试代码',
    panel: 'Command Menu',
    difficulty: 2,
    prerequisite: 'animations-panel',
    badgeLabel: '效率达人',
  },
  Scenario: CommandMenuScenario,
  guide,
  fixDoc,
};
