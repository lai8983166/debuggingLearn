/**
 * Badge grid — shows all available badges; earned ones in color, locked
 * ones grayed out.
 */

import { getAllLabs } from '@/labs/registry';
import { useProgressStore } from '@/store/progressStore';
import clsx from 'clsx';
import './BadgeGrid.css';

export function BadgeGrid() {
  const labs = getAllLabs();
  const badges = useProgressStore((s) => s.badges);

  if (labs.length === 0) {
    return <p className="badge-grid__empty">暂无徽章可领。</p>;
  }

  return (
    <div className="badge-grid">
      {labs.map((lab) => {
        const earned = badges.includes(lab.meta.slug);
        return (
          <div
            key={lab.meta.slug}
            className={clsx('badge', { 'badge--locked': !earned })}
            title={earned ? lab.meta.badgeLabel : '未解锁'}
          >
            <span className="badge__emoji">{earned ? '🏆' : '🔒'}</span>
            <span className="badge__label">{lab.meta.badgeLabel}</span>
            <span className="badge__panel">{lab.meta.panel}</span>
          </div>
        );
      })}
    </div>
  );
}
