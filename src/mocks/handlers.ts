/**
 * MSW handlers — simulated API endpoints for lab 4 (network-failing-api).
 *
 * Real requests are intercepted at the Service Worker layer so they show up
 * in the DevTools Network panel exactly like real network calls.
 */

import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Working endpoint — used to compare against the broken one.
  http.get('/api/health', () => HttpResponse.json({ ok: true })),

  // [TEACHING_BUG] Simulated server error: this endpoint always 500s.
  // The lab scenario swallows the error so the UI silently fails.
  http.get('/api/articles', () =>
    HttpResponse.json(
      { error: 'Internal Server Error: db connection lost' },
      { status: 500 },
    ),
  ),

  // Lab 8 — feedback endpoint. Validates that the payload uses the
  // correct field name 'contactEmail'. Rejects with 400 + helpful message
  // when the typo'd 'contactMail' is sent.
  http.post('/api/feedback', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    if (!('message' in body) || typeof body.message !== 'string' || body.message.length === 0) {
      return HttpResponse.json({ error: 'Bad Request: missing message' }, { status: 400 });
    }
    if ('contactMail' in body) {
      return HttpResponse.json(
        {
          error:
            'Bad Request: unknown field "contactMail". Did you mean "contactEmail"? (Schema only accepts message, rating, contactEmail)',
        },
        { status: 400 },
      );
    }
    return HttpResponse.json({ ok: true, received: body });
  }),

  // Lab 13 — async race condition. Two queries with very different
  // latencies so the late-fired one resolves LAST and overwrites the
  // fresh result. `q=A` is slow (1500ms), `q=B` is fast (200ms).
  // Typing "A" then "B" within 200ms produces the classic race: UI first
  // shows B (correct), then gets clobbered by A (stale) 1.3s later.
  http.get('/api/search', async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? '';
    if (q.includes('A')) {
      await delay(1500);
      return HttpResponse.json({ query: q, results: [`Alpha for "${q}"`, 'Albatross', 'Almond'] });
    }
    await delay(200);
    return HttpResponse.json({ query: q, results: [`Beta for "${q}"`, 'Banana', 'Berry'] });
  }),
];
