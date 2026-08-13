import { Outlet } from 'react-router-dom';

// Stub — real shell (header + progress bar + badge entry) added in task group 2.
export function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
