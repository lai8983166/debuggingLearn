/**
 * WebVitalsMeter — displays real-time LCP / CLS / INP values via
 * PerformanceObserver. Helps learners see the metrics change as they
 * apply fixes.
 *
 * - LCP (Largest Contentful Paint): time of largest paint event
 * - CLS (Cumulative Layout Shift): sum of layout-shift entries
 * - INP (Interaction to Next Paint): max interaction duration
 *
 * Thresholds (per web.dev):
 *   LCP: < 2500ms good, < 4000ms needs improvement, else poor
 *   CLS: < 0.1 good,    < 0.25 needs improvement, else poor
 *   INP: < 200ms good,  < 500ms needs improvement, else poor
 */

import { useEffect, useRef, useState } from 'react';
import './WebVitalsMeter.css';

interface Vitals {
  lcp: number | null;
  cls: number;
  inp: number | null;
}

const GOOD = 'var(--color-success)';
const WARN = 'var(--color-warning)';
const BAD = 'var(--color-error)';

function lcpColor(ms: number | null) {
  if (ms == null) return 'var(--color-text-dim)';
  if (ms < 2500) return GOOD;
  if (ms < 4000) return WARN;
  return BAD;
}
function clsColor(v: number) {
  if (v < 0.1) return GOOD;
  if (v < 0.25) return WARN;
  return BAD;
}
function inpColor(ms: number | null) {
  if (ms == null) return 'var(--color-text-dim)';
  if (ms < 200) return GOOD;
  if (ms < 500) return WARN;
  return BAD;
}

export function WebVitalsMeter() {
  const [v, setV] = useState<Vitals>({ lcp: null, cls: 0, inp: null });
  const lcpRef = useRef<number | null>(null);
  const clsRef = useRef(0);
  const inpRef = useRef<number | null>(null);

  useEffect(() => {
    // LCP observer — keeps the latest value
    const lcpObs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        lcpRef.current = entry.startTime;
      }
      setV({ lcp: lcpRef.current, cls: clsRef.current, inp: inpRef.current });
    });
    try {
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* browser may not support */
    }

    // CLS observer — accumulate session value
    const clsObs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as unknown as { hadRecentInput?: boolean; value: number };
        if (!e.hadRecentInput) {
          clsRef.current += e.value;
        }
      }
      setV({ lcp: lcpRef.current, cls: clsRef.current, inp: inpRef.current });
    });
    try {
      clsObs.observe({ type: 'layout-shift', buffered: true });
    } catch {
      /* ignore */
    }

    // INP — worst interaction duration during session
    const inpObs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const dur = (entry as { duration: number }).duration;
        if (inpRef.current == null || dur > inpRef.current) {
          inpRef.current = dur;
        }
      }
      setV({ lcp: lcpRef.current, cls: clsRef.current, inp: inpRef.current });
    });
    try {
      inpObs.observe({ type: 'event', buffered: true });
    } catch {
      /* ignore */
    }

    return () => {
      lcpObs.disconnect();
      clsObs.disconnect();
      inpObs.disconnect();
    };
  }, []);

  const fmt = (ms: number | null) => (ms == null ? '—' : `${Math.round(ms)}ms`);

  return (
    <div className="wv-meter" aria-label="实时 Web Vitals">
      <span className="wv-meter__item" style={{ color: lcpColor(v.lcp) }}>
        LCP <strong>{fmt(v.lcp)}</strong>
      </span>
      <span className="wv-meter__item" style={{ color: clsColor(v.cls) }}>
        CLS <strong>{v.cls.toFixed(3)}</strong>
      </span>
      <span className="wv-meter__item" style={{ color: inpColor(v.inp) }}>
        INP <strong>{fmt(v.inp)}</strong>
      </span>
    </div>
  );
}
