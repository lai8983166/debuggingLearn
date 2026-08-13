import { Link } from 'react-router-dom';
import { getAllLabs, isUnlocked } from '@/labs/registry';
import { useProgressStore } from '@/store/progressStore';
import clsx from 'clsx';
import './LabsIndexPage.css';

export function LabsIndexPage() {
  const labs = getAllLabs();
  const completedSet = useProgressStore((s) => new Set(s.completed));

  if (labs.length === 0) {
    return (
      <div className="labs-index__empty">
        <h2>关卡列表</h2>
        <p>关卡还在准备中。先看看<a href="/">项目介绍</a>吧。</p>
      </div>
    );
  }

  return (
    <div className="labs-index">
      <header className="labs-index__header">
        <h2>关卡列表</h2>
        <p>按难度从低到高排列，完成前一关解锁下一关。</p>
      </header>

      <div className="labs-index__grid">
        {labs.map((lab, i) => {
          const unlocked = isUnlocked(lab.meta.slug, completedSet);
          const completed = completedSet.has(lab.meta.slug);
          return (
            <Link
              key={lab.meta.slug}
              to={unlocked ? `/labs/${lab.meta.slug}` : '#'}
              className={clsx('lab-card', {
                'lab-card--locked': !unlocked,
                'lab-card--done': completed,
              })}
              onClick={(e) => {
                if (!unlocked) {
                  e.preventDefault();
                  window.alert(
                    `请先完成前置关卡：${
                      labs[i - 1]?.meta.title ?? '上一关'
                    }`,
                  );
                }
              }}
            >
              <div className="lab-card__head">
                <span className="lab-card__index">#{i + 1}</span>
                <span className="lab-card__panel">{lab.meta.panel}</span>
                <span className="lab-card__diff">
                  {'★'.repeat(lab.meta.difficulty)}
                  {'☆'.repeat(3 - lab.meta.difficulty)}
                </span>
              </div>
              <h3 className="lab-card__title">
                {completed && <span className="lab-card__check">✓</span>}
                {!unlocked && <span className="lab-card__lock">🔒</span>}
                {lab.meta.title}
              </h3>
              <p className="lab-card__goal">{lab.meta.learningGoal}</p>
              <div className="lab-card__badge">🏅 {lab.meta.badgeLabel}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
