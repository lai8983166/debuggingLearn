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

describe('teaching-bug: lab 09 lighthouse-audit', () => {
  it('teaching-bug: hero img missing alt/width/height/loading, low-contrast CTA', () => {
    const tsx = readSrc('./09-lighthouse-audit/Scenario.tsx');
    const css = readSrc('./09-lighthouse-audit/Scenario.css');
    expect(tsx).toMatch(/\[TEACHING_BUG\]/);
    expect(tsx).toMatch(/<img\s[^>]*src="https:\/\/picsum\.photos\/2000\/1200"/);
    // The hero img tag must NOT include alt or loading
    const heroLine = tsx.match(/<img[\s\S]*?src="https:\/\/picsum\.photos\/2000\/1200"[\s\S]*?\/>/);
    expect(heroLine).not.toBeNull();
    expect(heroLine![0]).not.toMatch(/\balt=/);
    // Low-contrast CTA color combo (white bg + yellow text)
    expect(css).toMatch(/background:\s*#ffffff/);
    expect(css).toMatch(/color:\s*#fde047/);
  });
});

describe('teaching-bug: lab 10 coverage-unused-code', () => {
  it('teaching-bug: 50KB+ unused array + utility functions retained via debug link', () => {
    const src = readSrc('./10-coverage-unused-code/Scenario.tsx');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    expect(src).toMatch(/BIG_UNUSED_ARRAY/);
    expect(src).toMatch(/length:\s*5000/);
    expect(src).toMatch(/unusedUtils/);
  });
});

describe('teaching-bug: lab 11 mobile-emulation', () => {
  it('teaching-bug: !important in media query + no default grid-template-columns', () => {
    const css = readSrc('./11-mobile-emulation/Scenario.css');
    expect(css).toMatch(/\[TEACHING_BUG\]/);
    expect(css).toMatch(/grid-template-columns:\s*repeat\(3,\s*1fr\)\s*!important/);
    // The base .mob__grid rule must NOT declare grid-template-columns (the bug:
    // it relies on the browser default)
    const baseRule = css.match(/\.mob__grid\s*\{([^}]*)\}/);
    expect(baseRule).not.toBeNull();
    expect(baseRule![1]).not.toMatch(/grid-template-columns/);
  });
});

describe('teaching-bug: lab 12 web-vitals', () => {
  it('teaching-bug: hero img no width/height/loading + sync 500ms onClick + zero-height placeholder', () => {
    const tsx = readSrc('./12-web-vitals/Scenario.tsx');
    const css = readSrc('./12-web-vitals/Scenario.css');
    expect(tsx).toMatch(/\[TEACHING_BUG\]/);
    // LCP bug: hero with picsum 2000x1500 without width/height/loading
    expect(tsx).toMatch(/src="https:\/\/picsum\.photos\/2000\/1500"/);
    // INP bug: 500ms synchronous busy-wait
    expect(tsx).toMatch(/while\s*\(\s*Date\.now\(\)\s*-\s*start\s*<\s*500\s*\)/);
    // CLS bug: zero-height placeholder div
    expect(css).toMatch(/\.wv__placeholder-bad/);
    expect(css).toMatch(/min-height:\s*0/);
  });
});

describe('teaching-bug: lab 13 async-race-condition', () => {
  it('teaching-bug: fetch then setOutput without serial check or abort', () => {
    const src = readSrc('./13-async-race-condition/Scenario.tsx');
    const handlers = readSrc('./../mocks/handlers.ts');
    expect(src).toMatch(/\[TEACHING_BUG\]/);
    // MSW must have asymmetric delays: A=1500, B=200
    expect(handlers).toMatch(/q\.includes\('A'\)[\s\S]*?delay\(1500\)/);
    expect(handlers).toMatch(/delay\(200\)/);
  });
});

describe('teaching-bug: lab 14 animations-panel', () => {
  it('teaching-bug: all three animations use linear easing', () => {
    const css = readSrc('./14-animations-panel/Scenario.css');
    expect(css).toMatch(/\[TEACHING_BUG\]/);
    // Must have at least 3 linear timing functions
    const matches = css.match(/linear/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });
});

describe('teaching-bug: lab 15 command-menu-snippets', () => {
  it('teaching-bug: no [TEACHING_BUG] marker (this lab has no bug by design)', () => {
    const tsx = readSrc('./15-command-menu-snippets/Scenario.tsx');
    // This lab is intentionally bug-free; assert it has at least 10 tasks
    expect(tsx).toMatch(/id:\s*'cmd-k'/);
    expect(tsx).toMatch(/id:\s*'snippet-run'/);
    // Count task id entries
    const taskCount = (tsx.match(/^\s*id:\s*'/gm) ?? []).length;
    expect(taskCount).toBeGreaterThanOrEqual(10);
  });
});

describe('teaching-bug: lab 16 service-worker-offline', () => {
  it('teaching-bug: SW uses cache-first strategy that never revalidates /api/version', () => {
    const sw = readSrc('./../../public/sw-lab.js');
    expect(sw).toMatch(/\[TEACHING_BUG\]/);
    expect(sw).toMatch(/VERSION_URL/);
    expect(sw).toMatch(/cache-first/);
    // Cache match short-circuits before fetch
    expect(sw).toMatch(/const cached = await cache\.match\(event\.request\)/);
    expect(sw).toMatch(/if \(cached\) return cached/);
  });
});
