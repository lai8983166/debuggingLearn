/**
 * Reverse (regression) tests for teaching bugs.
 *
 * Purpose: protect intentional bugs from being "fixed" by future maintainers
 * who don't realize they are part of the curriculum. Each scenario below is
 * named with the substring "teaching-bug" so `npm run test:bugs` (vitest
 * --testNamePattern="teaching-bug") can run only these in CI.
 *
 * Strategy: read each scenario's source file and assert that the bug marker
 * and characteristic broken code is still present. This catches both
 * accidental bug fixes AND accidental marker removal.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readSrc(relPath: string): string {
  return readFileSync(resolve(__dirname, relPath), 'utf-8');
}

describe('teaching-bug: lab 1 console-errors', () => {
  it('teaching-bug: config is asserted to non-undefined and accessed via .endpoint', () => {
    const src = readSrc('./01-console-errors/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    expect(src).toMatch(/config\.endpoint/);
    expect(src).toMatch(/as unknown as/); // the lie that hides undefined
  });
});

describe('teaching-bug: lab 2 elements-dom', () => {
  it('teaching-bug: .buggy-grid uses flex-direction: column-reverse', () => {
    const css = readSrc('./02-elements-dom/Scenario.css');
    expect(css).toMatch(/\[TEACHING_BUG\]/);
    expect(css).toMatch(/flex-direction:\s*column-reverse/);
  });

  it('teaching-bug: list uses array index as key (not stable id)', () => {
    const src = readSrc('./02-elements-dom/Scenario.tsx');
    expect(src).toMatch(/key=\{i\}/);
  });
});

describe('teaching-bug: lab 3 sources-breakpoint', () => {
  it('teaching-bug: computeTotal multiplies by 2', () => {
    const src = readSrc('./03-sources-breakpoint/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    expect(src).toMatch(/item\.unitPrice\s*\*\s*item\.qty\s*\*\s*2/);
  });
});

describe('teaching-bug: lab 4 network-failing-api', () => {
  it('teaching-bug: scenario swallows non-ok response silently', () => {
    const src = readSrc('./04-network-failing-api/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    expect(src).toMatch(/if\s*\(!res\.ok\)/);
    expect(src).toMatch(/return\s+\[\]\s+as\s+Article\[\]/);
  });

  it('teaching-bug: handlers return 500 for /api/articles', () => {
    const src = readSrc('./../mocks/handlers.ts');
    expect(src).toMatch(/\/api\/articles[\s\S]+?status:\s*500/);
  });
});

describe('teaching-bug: lab 5 application-storage', () => {
  it('teaching-bug: write key is misspelled (tokn instead of token)', () => {
    const src = readSrc('./05-application-storage/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    expect(src).toMatch(/app\.session\.tokn/);
    expect(src).toMatch(/app\.session\.token/);
  });
});

describe('teaching-bug: lab 6 performance-jank', () => {
  it('teaching-bug: every animation frame runs expensiveComputation', () => {
    const src = readSrc('./06-performance-jank/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    // The expensive call must be inside the animate() loop
    expect(src).toMatch(/const animate[\s\S]*?expensiveComputation/);
    // Allow numeric separators (300_000). 3+ digits after stripping underscores.
    expect(src).toMatch(/expensiveComputation\(\d[\d_]*\)/);
  });
});

describe('teaching-bug: lab 7 memory-leak', () => {
  it('teaching-bug: cleanup is intentionally empty (no actual cleanup calls)', () => {
    const raw = readSrc('./07-memory-leak/Scenario.tsx');
    expect(raw).toMatch(/\[TEACHING_BUG\]/);

    // Strip line + block comments so prose like "应该写 removeEventListener"
    // in documentation comments doesn't satisfy the test.
    const noLineComments = raw.replace(/\/\/[^\n]*/g, '');
    const noBlockComments = noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
    const code = noBlockComments;

    const cleanupMatch = code.match(/return\s*\(\)\s*=>\s*\{([\s\S]*?)\}/);
    expect(cleanupMatch).not.toBeNull();
    const cleanup = cleanupMatch![1];
    expect(cleanup).not.toMatch(/removeEventListener/);
    expect(cleanup).not.toMatch(/clearInterval/);
  });

  it('teaching-bug: leakPool holds references at module scope', () => {
    const src = readSrc('./07-memory-leak/Scenario.tsx');
    expect(src).toMatch(/const leakPool/);
    expect(src).toMatch(/leakPool\.push\(sink\)/);
  });
});

describe('teaching-bug: lab 8 comprehensive', () => {
  it('teaching-bug: payload uses contactMail (typo) instead of contactEmail', () => {
    const src = readSrc('./08-comprehensive/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    expect(src).toMatch(/contactMail/);
    // Server-side schema should reject this name; verify handlers reject it.
    const handlers = readSrc('./../mocks/handlers.ts');
    expect(handlers).toMatch(/contactMail[\s\S]+Did you mean "contactEmail"/);
  });
});
