/**
 * Lab registry.
 *
 * Labs are added by:
 *   1. Creating `src/labs/<slug>/` with Scenario.tsx, guide.ts, FIX.md
 *   2. Appending a Lab entry to the `labs` array below
 *
 * Order in the array = order on the labs index page = unlock order.
 */

import type { Lab } from './types';
import { lab as consoleErrors } from './01-console-errors';
import { lab as elementsDom } from './02-elements-dom';
import { lab as sourcesBreakpoint } from './03-sources-breakpoint';
import { lab as networkFailingApi } from './04-network-failing-api';
import { lab as applicationStorage } from './05-application-storage';
import { lab as performanceJank } from './06-performance-jank';
import { lab as memoryLeak } from './07-memory-leak';
import { lab as comprehensive } from './08-comprehensive';
import { lab as lighthouseAudit } from './09-lighthouse-audit';
import { lab as coverageUnusedCode } from './10-coverage-unused-code';
import { lab as mobileEmulation } from './11-mobile-emulation';
import { lab as webVitals } from './12-web-vitals';
import { lab as asyncRaceCondition } from './13-async-race-condition';
import { lab as animationsPanel } from './14-animations-panel';
import { lab as commandMenuSnippets } from './15-command-menu-snippets';
import { lab as serviceWorkerOffline } from './16-service-worker-offline';
import { lab as sourceMaps } from './17-source-maps';
import { lab as websocketDebug } from './18-websocket-debug';
import { lab as corsErrors } from './19-cors-errors';
import { lab as thirdPartyCookies } from './20-third-party-cookies';
import { lab as renderingPanel } from './21-rendering-panel';
import { lab as saasDashboard } from './22-saas-dashboard';
import { lab as reactDevTools } from './23-react-devtools';
import { lab as recorderPanel } from './24-recorder-panel';
import { lab as layersPanel } from './25-layers-panel';
import { lab as crossBrowser } from './26-cross-browser';
import { lab as remoteDebugging } from './27-remote-debugging';

const labs: Lab[] = [
  consoleErrors,
  elementsDom,
  sourcesBreakpoint,
  networkFailingApi,
  applicationStorage,
  performanceJank,
  memoryLeak,
  comprehensive,
  lighthouseAudit,
  coverageUnusedCode,
  mobileEmulation,
  webVitals,
  asyncRaceCondition,
  animationsPanel,
  commandMenuSnippets,
  serviceWorkerOffline,
  sourceMaps,
  websocketDebug,
  corsErrors,
  thirdPartyCookies,
  renderingPanel,
  saasDashboard,
  reactDevTools,
  recorderPanel,
  layersPanel,
  crossBrowser,
  remoteDebugging,
];

/**
 * Return all registered labs in canonical order.
 */
export function getAllLabs(): Lab[] {
  return labs;
}

/**
 * Look up a single lab by slug. Returns `null` if not found.
 */
export function getLab(slug: string): Lab | null {
  return labs.find((lab) => lab.meta.slug === slug) ?? null;
}

/**
 * Index of a lab in the registry (0-based). Returns -1 if not registered.
 */
export function getLabIndex(slug: string): number {
  return labs.findIndex((lab) => lab.meta.slug === slug);
}

/**
 * Determine whether a lab is unlocked given the set of completed slugs.
 *
 * Rules:
 *   - The first lab (index 0) is always unlocked.
 *   - Lab at index i > 0 is unlocked iff its `prerequisite` slug is in
 *     `completedSlugs`. Falls back to "previous lab in the array is
 *     completed" when prerequisite is null but index > 0.
 */
export function isUnlocked(slug: string, completedSlugs: ReadonlySet<string>): boolean {
  const index = getLabIndex(slug);
  if (index === -1) return false;
  if (index === 0) return true;

  const lab = labs[index];
  const prereqSlug = lab.meta.prerequisite ?? labs[index - 1]?.meta.slug;
  if (!prereqSlug) return true;
  return completedSlugs.has(prereqSlug);
}

/**
 * Get the next lab (by registry order), or null if this is the last.
 */
export function getNextLab(slug: string): Lab | null {
  const index = getLabIndex(slug);
  if (index === -1 || index >= labs.length - 1) return null;
  return labs[index + 1];
}

// Allow labs to self-register at import time. We export an internal helper
// that lab modules call at module-eval; the first call triggers a re-sort
// by registry order. (Not used yet — labs are added directly to the array
// above for simplicity. Hook exists for future dynamic loading.)
export function _registerLab(_lab: Lab): void {
  // Intentionally a no-op stub; reserved for future dynamic registration.
}

/**
 * @internal Test-only helper: swap the labs array. Production code MUST NOT
 * call this — it exists so unit tests can exercise `isUnlocked` / `getNextLab`
 * without coupling to real lab modules.
 */
export function _setLabsForTesting(newLabs: Lab[]): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('_setLabsForTesting must not be called in production');
  }
  labs.length = 0;
  labs.push(...newLabs);
}
