/**
 * Step Tour widget — the second guidance channel.
 *
 * Renders a floating widget in the bottom-right showing the current step's
 * body, an outline highlight over the configured page element (if any),
 * and Prev/Next navigation.
 *
 * Behavior:
 *  - Minimize: collapses to a small chip that re-expands on click.
 *  - Close: hides entirely; "显示引导" button (rendered elsewhere) brings it back.
 *  - State (current step, minimized, closed) lives in component state;
 *    parent re-mounting resets it.
 *
 * Limitation: cannot highlight the DevTools panel itself (browser doesn't
 * expose DevTools DOM). For DevTools-operation steps, embed a screenshot
 * via `TourStep.devToolsScreenshot`.
 */

import { useEffect, useState } from 'react';
import type { TourStep } from '@/labs/types';
import './StepTour.css';

interface StepTourProps {
  steps: TourStep[];
  onClose: () => void;
}

export function StepTour({ steps, onClose }: StepTourProps) {
  const [index, setIndex] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const step = steps[index];
  const total = steps.length;

  // Clamp index if steps array changes identity.
  useEffect(() => {
    if (index > steps.length - 1) setIndex(Math.max(0, steps.length - 1));
  }, [steps.length, index]);

  if (step == null) return null;

  if (minimized) {
    return (
      <div className="step-tour step-tour--min" role="status">
        <button
          type="button"
          className="step-tour__chip"
          onClick={() => setMinimized(false)}
          aria-label="展开引导"
        >
          引导 ({index + 1}/{total})
        </button>
      </div>
    );
  }

  return (
    <>
      {step.highlightSelector && <Highlight selector={step.highlightSelector} />}
      <div className="step-tour" role="dialog" aria-label="步骤引导">
        <div className="step-tour__header">
          <span className="step-tour__counter">
            第 {index + 1} / {total} 步
            {step.title ? <span className="step-tour__title"> · {step.title}</span> : null}
          </span>
          <div className="step-tour__header-actions">
            <button
              type="button"
              className="step-tour__btn step-tour__btn--ghost"
              onClick={() => setMinimized(true)}
              aria-label="最小化"
              title="最小化"
            >
              –
            </button>
            <button
              type="button"
              className="step-tour__btn step-tour__btn--ghost"
              onClick={onClose}
              aria-label="关闭"
              title="关闭"
            >
              ×
            </button>
          </div>
        </div>

        {step.devToolsScreenshot && (
          <div className="step-tour__shot">
            <DevToolsScreenshotPlaceholder name={step.devToolsScreenshot} />
          </div>
        )}

        <div className="step-tour__body">{step.body}</div>

        <div className="step-tour__footer">
          <button
            type="button"
            className="step-tour__btn"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            上一步
          </button>
          <button
            type="button"
            className="step-tour__btn step-tour__btn--primary"
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            disabled={index === total - 1}
          >
            下一步
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Outline-highlight overlay. Renders an absolutely-positioned yellow box
 * around the first element matching `selector`, re-measured on resize.
 */
function Highlight({ selector }: { selector: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(selector);
      if (!el) {
        setRect(null);
        return;
      }
      setRect(el.getBoundingClientRect());
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    // Re-measure on a short interval for the first second (animations, etc).
    const handles = [0, 100, 250, 500, 1000].map((ms) =>
      window.setTimeout(measure, ms),
    );
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      handles.forEach(clearTimeout);
    };
  }, [selector]);

  if (!rect) return null;
  return (
    <div
      className="step-tour__highlight"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
      aria-hidden
    />
  );
}

/**
 * Placeholder for a DevTools panel screenshot. Real screenshots can be
 * dropped into src/assets/devtools-screenshots/<name>.png and referenced
 * here later; for now we render a labeled box so the layout is correct.
 */
function DevToolsScreenshotPlaceholder({ name }: { name: string }) {
  return (
    <div className="step-tour__shot-placeholder" aria-label={`DevTools 截图: ${name}`}>
      <span>📸 DevTools 截图</span>
      <code>{name}</code>
    </div>
  );
}
