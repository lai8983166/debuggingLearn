/**
 * Reflection dialog — multiple-choice root-cause question.
 *
 * Used by ValidateButton when a lab's guide has `reflection` configured
 * (i.e., the root cause can't be auto-verified from page state).
 *
 * Flow:
 *  1. Render question prompt + options
 *  2. On selection, immediately commit and show explanation
 *  3. On correct, call onSuccess(); on wrong, allow retry (no permanent state)
 */

import { useState } from 'react';
import type { ReflectionQuestion } from '@/labs/types';
import './ReflectionDialog.css';

interface ReflectionDialogProps {
  question: ReflectionQuestion;
  onSuccess: () => void;
  onClose: () => void;
}

export function ReflectionDialog({ question, onSuccess, onClose }: ReflectionDialogProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === question.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === question.correctIndex) {
      // Briefly show explanation, then signal success.
      window.setTimeout(onSuccess, 800);
    }
  };

  return (
    <div className="reflection" role="dialog" aria-label="根因选择题">
      <div className="reflection__card">
        <div className="reflection__header">
          <span className="reflection__title">🔍 选出 bug 的根因</span>
          <button type="button" className="reflection__close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <p className="reflection__prompt">{question.prompt}</p>
        <ul className="reflection__options">
          {question.options.map((opt, i) => {
            const isThis = selected === i;
            const showState = submitted && isThis;
            return (
              <li key={i}>
                <button
                  type="button"
                  className={[
                    'reflection__option',
                    showState ? (isCorrect ? 'reflection__option--correct' : 'reflection__option--wrong') : '',
                    submitted && i === question.correctIndex ? 'reflection__option--reveal' : '',
                  ].join(' ')}
                  disabled={submitted && isCorrect}
                  onClick={() => !submitted && setSelected(i)}
                >
                  <span className="reflection__letter">{String.fromCharCode(65 + i)}</span>
                  <span className="reflection__text">{opt}</span>
                  {showState && (isCorrect ? ' ✓' : ' ✗')}
                </button>
              </li>
            );
          })}
        </ul>
        {submitted && question.explanation && (
          <p className="reflection__explanation">{question.explanation}</p>
        )}
        <div className="reflection__actions">
          {!submitted && (
            <button
              type="button"
              className="btn btn--primary"
              disabled={selected === null}
              onClick={handleSubmit}
            >
              提交答案
            </button>
          )}
          {submitted && !isCorrect && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setSelected(null);
                setSubmitted(false);
              }}
            >
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
