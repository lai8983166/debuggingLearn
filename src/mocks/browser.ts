/**
 * MSW browser setup. `setupWorker` registers the Service Worker that
 * intercepts matching requests at the network layer.
 *
 * The worker is enabled in dev (npm run dev) and any static deployment
 * where `mockServiceWorker.js` is bundled. In production deployments
 * without MSW, the labs should gracefully fall back to `fetch()` errors
 * (the Network lab still functions because the fetch will reject).
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
