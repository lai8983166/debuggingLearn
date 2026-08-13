/**
 * App shell — top nav + brand + progress + outlet for routed pages.
 *
 * Also mounts the global Toaster so any component can fire toasts.
 */

import { Link, Outlet } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { Toaster } from './Toast';
import { useProgressStore } from '@/store/progressStore';

export function AppShell() {
  const persistenceError = useProgressStore((s) => s.persistenceError);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <Link to="/">🛠 DevTools 教学实验室</Link>
        </div>
        <nav className="app-header__meta">
          <Link to="/labs">关卡列表</Link>
          <ProgressBar />
        </nav>
      </header>

      {persistenceError && (
        <div className="app-banner app-banner--warn">{persistenceError}</div>
      )}

      <main className="app-main">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}
