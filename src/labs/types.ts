/**
 * Core domain types for the lab system.
 *
 * A "Lab" is one self-contained debugging scenario. Each lab lives under
 * `src/labs/<slug>/` and is registered in `src/labs/registry.ts`.
 */

import type { ComponentType, ReactNode } from 'react';

/** DevTools panel that a lab trains. */
export type DevToolsPanel =
  | 'Console'
  | 'Elements'
  | 'Sources'
  | 'Network'
  | 'Application'
  | 'Performance'
  | 'Memory'
  | 'Comprehensive'
  // v2 advanced panels
  | 'Lighthouse'
  | 'Coverage'
  | 'Device Mode'
  | 'Web Vitals'
  | 'Async'
  | 'Animations'
  | 'Command Menu'
  | 'Service Worker';

/** Difficulty 1 (easy) .. 3 (hard). Drives ordering in the labs index. */
export type Difficulty = 1 | 2 | 3;

/** Structured metadata shown on lab cards and used by the unlock logic. */
export interface LabMeta {
  /** URL-safe identifier, also the route param. */
  slug: string;
  /** Human-readable title. */
  title: string;
  /** One-sentence description of the DevTools panel/skill trained. */
  learningGoal: string;
  /** The DevTools panel this lab trains. */
  panel: DevToolsPanel;
  /** Difficulty 1-3. */
  difficulty: Difficulty;
  /** Slug of the lab that must be completed before this one unlocks. `null` for the first lab. */
  prerequisite: string | null;
  /** Short label for the badge awarded on completion (e.g. "Console 侦探"). */
  badgeLabel: string;
}

/** Result returned by a lab's `validate()` function. */
export interface ValidationResult {
  /** True if the learner correctly identified/fixed the bug. */
  passed: boolean;
  /** Feedback shown when not passed (hint toward next step). Empty when passed. */
  feedback: string;
}

/** One entry in the Console auto-guidance sequence. */
export interface ConsoleHint {
  /** Message body. Will be prefixed with `[Lab]` and styled. */
  message: string;
  /** Optional emoji prefix for visual scanning. */
  emoji?: string;
}

/** One step in the floating step-tour widget. */
export interface TourStep {
  /** Instruction shown in the tour widget body. */
  body: ReactNode;
  /**
   * Optional CSS selector for an element to outline-highlight on the page.
   * Cannot highlight DevTools panels themselves — use `devToolsScreenshot`
   * for steps that ask the learner to operate DevTools.
   */
  highlightSelector?: string;
  /** Optional path/identifier of a DevTools panel screenshot to embed. */
  devToolsScreenshot?: string;
  /** Optional short title shown above the body. */
  title?: string;
}

/** One level of progressive text hint (vague -> specific -> answer location). */
export interface Hint {
  /** The hint text. */
  text: string;
}

/**
 * A "reflective" validation question — used when we can't directly detect
 * what the learner did in DevTools, so we ask them to pick the root cause.
 */
export interface ReflectionQuestion {
  /** The question prompt. */
  prompt: string;
  /** Answer options. */
  options: string[];
  /** Index of the correct option. */
  correctIndex: number;
  /** Optional explanation shown after answering (right or wrong). */
  explanation?: string;
}

/**
 * Per-lab guidance configuration. Drives the unified <LabGuide> component.
 */
export interface LabGuideConfig {
  /** Console messages printed automatically (first on mount, rest on "next hint"). */
  consoleHints: ConsoleHint[];
  /** Floating tour steps. */
  steps: TourStep[];
  /** Progressive text hints shown on demand. */
  hints: Hint[];
  /**
   * Active validation — runs against page DOM/state. Optional: labs that
   * cannot be auto-verified may omit this and rely on `reflection`.
   */
  validate?: () => ValidationResult;
  /**
   * Reflective validation — multiple-choice root-cause question. Optional.
   * If both `validate` and `reflection` are present, the lab uses mixed mode
   * (reflection first, then active verification).
   */
  reflection?: ReflectionQuestion;
}

/**
 * A complete lab definition. The `Scenario` component renders the buggy UI;
 * `fixDoc` is the markdown revealed only after validation passes.
 */
export interface Lab {
  meta: LabMeta;
  /** Component that renders the buggy scenario UI. */
  Scenario: ComponentType;
  /** Guidance configuration consumed by <LabGuide>. */
  guide: LabGuideConfig;
  /** Markdown document shown only after validation passes (the "answer"). */
  fixDoc: string;
}
