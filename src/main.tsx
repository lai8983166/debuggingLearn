import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import './styles/global.css';

async function bootstrap() {
  // Enable MSW only in dev / when Service Worker is available. Wrap in
  // try/catch so production deployments without mockServiceWorker.js still
  // work (the Network lab falls back to a real fetch that rejects).
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass', // don't warn about unrelated requests
        serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[MSW] Failed to start mock worker; labs will use real fetch.', e);
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

void bootstrap();
