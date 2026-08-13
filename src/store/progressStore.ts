/**
 * Progress store — tracks completed labs, earned badges, current lab, and
 * a versioned schema persisted to localStorage.
 *
 * Public API (zustand):
 *   - state: version, completed, badges, currentLab, lastActiveAt, persistenceError
 *   - actions: markComplete(slug, badgeId), reset(), exportProgress(),
 *              setCurrentLab(slug), hasBadge(id), isCompleted(slug)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Current schema version. Bump when changing the shape of `Progress`. */
export const PROGRESS_VERSION = 1;

/** Storage key is versioned to allow clean migration or parallel installs. */
export const STORAGE_KEY = `devtools-lab-progress-v${PROGRESS_VERSION}`;

export interface Progress {
  /** Schema version. Older/newer values trigger migration / safe-degrade. */
  version: number;
  /** Slugs of completed labs. */
  completed: string[];
  /** Earned badge ids. */
  badges: string[];
  /** Slug of the lab the learner is currently on (for resume). */
  currentLab: string | null;
  /** Last activity timestamp (ms). */
  lastActiveAt: number;
}

export interface ProgressState extends Progress {
  /**
   * Set when localStorage.setItem throws (private mode / quota). When set,
   * the UI shows a warning that progress will not survive refresh.
   */
  persistenceError: string | null;

  /** Mark a lab as completed and award its badge. No-op if already completed. */
  markComplete: (slug: string, badgeId: string) => void;
  /** Clear all progress (after user confirmation). */
  reset: () => void;
  /** Serialize progress to JSON (for download). */
  exportProgress: () => string;
  /** Update currentLab and lastActiveAt. */
  setCurrentLab: (slug: string) => void;
  /** Check whether a badge has been earned. */
  hasBadge: (id: string) => boolean;
  /** Check whether a lab has been completed. */
  isCompleted: (slug: string) => boolean;
}

function makeInitial(): Progress {
  return {
    version: PROGRESS_VERSION,
    completed: [],
    badges: [],
    currentLab: null,
    lastActiveAt: Date.now(),
  };
}

/**
 * Validate raw data loaded from localStorage. Returns a normalized Progress
 * or null if the data is unrecoverable.
 *
 * Version mismatches are handled by the caller (we surface them as a "reset"
 * prompt rather than silently corrupting the data).
 */
function parseAndValidate(raw: unknown): Progress | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const p = raw as Partial<Progress>;
  if (p.version !== PROGRESS_VERSION) return null;
  if (!Array.isArray(p.completed) || !Array.isArray(p.badges)) return null;
  return {
    version: PROGRESS_VERSION,
    completed: p.completed.filter((s): s is string => typeof s === 'string'),
    badges: p.badges.filter((s): s is string => typeof s === 'string'),
    currentLab: typeof p.currentLab === 'string' ? p.currentLab : null,
    lastActiveAt: typeof p.lastActiveAt === 'number' ? p.lastActiveAt : Date.now(),
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...makeInitial(),
      persistenceError: null,

      markComplete: (slug, badgeId) => {
        const state = get();
        if (state.completed.includes(slug)) return; // idempotent
        set({
          completed: [...state.completed, slug],
          badges: state.badges.includes(badgeId) ? state.badges : [...state.badges, badgeId],
          lastActiveAt: Date.now(),
        });
      },

      reset: () => {
        set({ ...makeInitial(), persistenceError: get().persistenceError });
      },

      exportProgress: () => {
        const { version, completed, badges, currentLab, lastActiveAt } = get();
        const data: Progress = { version, completed, badges, currentLab, lastActiveAt };
        return JSON.stringify(data, null, 2);
      },

      setCurrentLab: (slug) => {
        set({ currentLab: slug, lastActiveAt: Date.now() });
      },

      hasBadge: (id) => get().badges.includes(id),

      isCompleted: (slug) => get().completed.includes(slug),
    }),
    {
      name: STORAGE_KEY,
      version: PROGRESS_VERSION,
      /**
       * Custom merge: validate the parsed JSON. If it's invalid or version-
       * mismatched, signal via persistenceError so the UI can prompt reset.
       */
      partialize: (s) => ({
        version: s.version,
        completed: s.completed,
        badges: s.badges,
        currentLab: s.currentLab,
        lastActiveAt: s.lastActiveAt,
      }),
      merge: (persisted, current) => {
        const base = current as ProgressState;
        const parsed = parseAndValidate(persisted);
        if (!parsed) {
          // Don't throw — surface to UI so learner can reset.
          return {
            ...base,
            ...makeInitial(),
            persistenceError:
              '进度数据版本不兼容，建议重置。Progress data version mismatch — please reset.',
          };
        }
        return { ...base, ...parsed, persistenceError: null };
      },
      /**
       * Catch storage write failures (private mode / quota) so the UI can
       * warn the learner that progress won't persist.
       */
      storage: {
        getItem: (name) => {
          try {
            const raw = localStorage.getItem(name);
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (e) {
            // Surface the error via a direct store mutation; we cannot use
            // set() here cleanly because we ARE inside the persist middleware,
            // but we can defer via queueMicrotask.
            const msg = e instanceof Error ? e.message : 'localStorage write failed';
            queueMicrotask(() =>
              useProgressStore.setState({ persistenceError: `进度无法持久化：${msg}` }),
            );
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            /* ignore */
          }
        },
      },
    },
  ),
);
