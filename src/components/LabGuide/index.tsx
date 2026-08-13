/**
 * <LabGuide> — wires together all four guidance channels for one lab.
 *
 * Layout (within LabPage):
 *   ┌─────────────────────────────────────────────┐
 *   │  Scenario (the buggy UI, rendered by parent) │
 *   ├─────────────────────────────────────────────┤
 *   │  HintButton     [检查答案]   [显示引导]      │  <- inline action bar
 *   ├─────────────────────────────────────────────┤
 *   │  FixReveal (only after validation passes)    │
 *   └─────────────────────────────────────────────┘
 *
 *   + floating StepTour in bottom-right (toggleable, presentation-mode aware)
 *   + Console hints emitted on mount and on demand
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Lab, ValidationResult } from '@/labs/types';
import { printHint, printSeparator } from '@/lib/consoleGuide';
import { useProgressStore } from '@/store/progressStore';
import { getNextLab } from '@/labs/registry';
import { StepTour } from './StepTour';
import { ValidateButton } from './ValidateButton';
import { HintButton } from './HintButton';
import { FixReveal } from './FixReveal';
import './LabGuide.css';

interface LabGuideProps {
  lab: Lab;
}

export function LabGuide({ lab }: LabGuideProps) {
  const { meta, guide } = lab;
  const [searchParams] = useSearchParams();
  const isPresentation = searchParams.get('presentation') === '1';

  const [hintIndex, setHintIndex] = useState(0);
  const [tourVisible, setTourVisible] = useState(!isPresentation);
  const [passed, setPassed] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<ValidationResult | null>(null);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isCompleted = useProgressStore((s) => s.completed.includes(meta.slug));
  const navigate = useNavigate();

  const nextLab = useMemo(() => getNextLab(meta.slug), [meta.slug]);

  // Console guidance channel — first hint on mount, separator on lab title.
  useEffect(() => {
    printSeparator(`关卡：${meta.title}`);
    if (guide.consoleHints.length > 0) {
      printHint(guide.consoleHints[0]);
    }
    return () => {
      // Reset hint pointer on unmount so re-entry prints from the top.
      setHintIndex(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.slug]);

  const handleNextConsoleHint = useCallback(() => {
    const next = hintIndex + 1;
    if (next >= guide.consoleHints.length) return;
    printHint(guide.consoleHints[next]);
    setHintIndex(next);
  }, [hintIndex, guide.consoleHints]);

  const handlePass = useCallback(() => {
    setPassed(true);
    markComplete(meta.slug, meta.slug); // badge id = slug
  }, [markComplete, meta.slug]);

  const handleFeedback = useCallback((r: ValidationResult) => {
    setLastFeedback(r);
  }, []);

  const goNext = useCallback(() => {
    if (nextLab) navigate(`/labs/${nextLab.meta.slug}`);
  }, [nextLab, navigate]);

  // Reflect completion if the learner previously passed this lab.
  useEffect(() => {
    if (isCompleted) setPassed(true);
  }, [isCompleted]);

  return (
    <>
      <div className="lab-guide__actions">
        <HintButton hints={guide.hints} resetKey={meta.slug} />

        {!isPresentation && guide.steps.length > 0 && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setTourVisible((v) => !v)}
          >
            {tourVisible ? '隐藏引导' : '显示引导'}
          </button>
        )}

        {guide.consoleHints.length > 1 && hintIndex < guide.consoleHints.length - 1 && (
          <button type="button" className="btn btn--ghost" onClick={handleNextConsoleHint}>
            Console 下一步提示
          </button>
        )}

        {!passed && (
          <ValidateButton config={guide} onPass={handlePass} onFeedback={handleFeedback} />
        )}
      </div>

      {lastFeedback && !lastFeedback.passed && (
        <div className="lab-guide__feedback lab-guide__feedback--fail">
          <strong>反馈：</strong> {lastFeedback.feedback}
        </div>
      )}

      {passed && <FixReveal lab={lab} nextLab={nextLab} onNext={goNext} />}

      {!isPresentation && tourVisible && guide.steps.length > 0 && (
        <StepTour steps={guide.steps} onClose={() => setTourVisible(false)} />
      )}
    </>
  );
}
