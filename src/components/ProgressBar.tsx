/**
 * Progress bar — shows completed / total labs.
 *
 * Subscribes to progressStore directly so it animates within ~200ms of a
 * markComplete() call without needing a page refresh.
 */

import { useProgressStore } from '@/store/progressStore';
import { getAllLabs } from '@/labs/registry';
import './ProgressBar.css';

export function ProgressBar() {
  const completed = useProgressStore((s) => s.completed);
  const total = getAllLabs().length;
  const done = completed.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={done} aria-valuemax={total}>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-bar__label">
        {done}/{total} 关卡
      </span>
    </div>
  );
}
