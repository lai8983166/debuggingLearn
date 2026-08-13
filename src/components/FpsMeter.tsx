/**
 * FpsMeter — a small widget that measures and displays the current frame
 * rate using requestAnimationFrame. Helps learners observe jank visually.
 *
 * Renders a sticky chip in the top-right of the scenario with the current
 * FPS value. Anything below ~50 fps means there's visible jank.
 */

import { useEffect, useRef, useState } from 'react';
import './FpsMeter.css';

export function FpsMeter() {
  const [fps, setFps] = useState(60);
  const lastTime = useRef<number>(performance.now());
  const frames = useRef<number>(0);

  useEffect(() => {
    let rafId = 0;
    const loop = () => {
      frames.current += 1;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frames.current * 1000) / (now - lastTime.current)));
        lastTime.current = now;
        frames.current = 0;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const color = fps >= 55 ? 'var(--color-success)' : fps >= 30 ? 'var(--color-warning)' : 'var(--color-error)';

  return (
    <div className="fps-meter" aria-label="实时帧率">
      <span className="fps-meter__dot" style={{ background: color }} />
      <span className="fps-meter__num" style={{ color }}>
        {fps}
      </span>
      <span className="fps-meter__unit">fps</span>
    </div>
  );
}
