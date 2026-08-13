import { afterEach, describe, expect, it } from 'vitest';
import {
  _setLabsForTesting,
  getAllLabs,
  getLab,
  getLabIndex,
  getNextLab,
  isUnlocked,
} from './registry';
import type { Lab } from './types';

function makeLab(slug: string, prerequisite: string | null = null): Lab {
  return {
    meta: {
      slug,
      title: `Lab ${slug}`,
      learningGoal: 'goal',
      panel: 'Console',
      difficulty: 1,
      prerequisite,
      badgeLabel: slug,
    },
    Scenario: () => null,
    guide: { consoleHints: [], steps: [], hints: [] },
    fixDoc: '',
  };
}

describe('registry helpers with mock data', () => {
  afterEach(() => {
    _setLabsForTesting([]);
  });

  it('getAllLabs returns registered labs in order', () => {
    _setLabsForTesting([makeLab('a'), makeLab('b'), makeLab('c')]);
    expect(getAllLabs().map((l) => l.meta.slug)).toEqual(['a', 'b', 'c']);
  });

  it('getLab finds by slug and returns null for unknown', () => {
    _setLabsForTesting([makeLab('a'), makeLab('b')]);
    expect(getLab('a')?.meta.slug).toBe('a');
    expect(getLab('z')).toBeNull();
  });

  it('getLabIndex returns -1 for unknown slugs', () => {
    _setLabsForTesting([makeLab('a')]);
    expect(getLabIndex('a')).toBe(0);
    expect(getLabIndex('z')).toBe(-1);
  });

  it('first lab is always unlocked regardless of completed set', () => {
    _setLabsForTesting([makeLab('a'), makeLab('b', 'a')]);
    expect(isUnlocked('a', new Set())).toBe(true);
  });

  it('lab with completed prerequisite is unlocked', () => {
    _setLabsForTesting([makeLab('a'), makeLab('b', 'a')]);
    expect(isUnlocked('b', new Set())).toBe(false);
    expect(isUnlocked('b', new Set(['a']))).toBe(true);
  });

  it('lab with null prerequisite falls back to previous-in-array rule', () => {
    _setLabsForTesting([makeLab('a', null), makeLab('b', null)]);
    // prerequisite is null, so the rule falls back to "previous lab in array completed"
    expect(isUnlocked('b', new Set())).toBe(false);
    expect(isUnlocked('b', new Set(['a']))).toBe(true);
  });

  it('unknown slug is never unlocked', () => {
    _setLabsForTesting([makeLab('a')]);
    expect(isUnlocked('z', new Set(['a']))).toBe(false);
  });

  it('getNextLab returns the next lab in order, null at the end', () => {
    _setLabsForTesting([makeLab('a'), makeLab('b'), makeLab('c')]);
    expect(getNextLab('a')?.meta.slug).toBe('b');
    expect(getNextLab('b')?.meta.slug).toBe('c');
    expect(getNextLab('c')).toBeNull();
  });
});
