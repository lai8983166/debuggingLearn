/**
 * Progressive hint button — the last-resort text channel.
 *
 * Starts at level 0 (no hint shown). Each click advances one level. Reaches
 * the end and stays there (disabled). Reset when `resetKey` changes (e.g.,
 * parent remounts on lab change).
 */

import { useEffect, useState } from 'react';
import type { Hint } from '@/labs/types';
import './HintButton.css';

interface HintButtonProps {
  hints: Hint[];
  resetKey?: string;
}

export function HintButton({ hints, resetKey }: HintButtonProps) {
  const [level, setLevel] = useState(0); // 0 = no hint shown
  const maxLevel = hints.length;

  // Reset when resetKey changes (lab switch).
  useEffect(() => {
    setLevel(0);
  }, [resetKey]);

  if (hints.length === 0) return null;

  const atEnd = level >= maxLevel;

  return (
    <div className="hint">
      {level > 0 && (
        <ul className="hint__list">
          {hints.slice(0, level).map((h, i) => (
            <li key={i} className="hint__item">
              <span className="hint__level">提示 {i + 1}</span>
              <span className="hint__text">{h.text}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="btn btn--ghost hint__btn"
        onClick={() => setLevel((l) => Math.min(maxLevel, l + 1))}
        disabled={atEnd}
      >
        {atEnd ? '提示已用完' : `提示 ${level > 0 ? `(已用 ${level}/${maxLevel})` : `(${maxLevel} 级)`}`}
      </button>
    </div>
  );
}
