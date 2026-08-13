/**
 * Validate button + dispatcher.
 *
 * Behavior depends on the lab's guide config:
 *  - `validate` only        -> run active validation, show feedback
 *  - `reflection` only      -> open ReflectionDialog, on success -> feedback
 *  - `validate` + `reflection` -> mixed mode: reflection first, then active
 *
 * On pass:
 *  - Console celebration (success channel)
 *  - Tour shows success icon
 *  - Toast
 *  - calls onPass() (parent handles badge + FIX reveal + next-lab CTA)
 *
 * On fail:
 *  - Tour shows feedback inline
 *  - Toast with feedback
 *  - Console NOT polluted (per spec)
 */

import { useState } from 'react';
import type { LabGuideConfig, ValidationResult } from '@/labs/types';
import { printCelebration } from '@/lib/consoleGuide';
import { toast } from '@/components/Toast';
import { ReflectionDialog } from './ReflectionDialog';

interface ValidateButtonProps {
  config: LabGuideConfig;
  onPass: () => void;
  /** Allows parent (LabGuide) to render feedback inline in the tour body. */
  onFeedback?: (result: ValidationResult) => void;
  label?: string;
}

export function ValidateButton({ config, onPass, onFeedback, label = '检查答案' }: ValidateButtonProps) {
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);

  const handleClick = () => {
    // Mixed mode: reflection first (if not yet passed), then active.
    if (config.reflection && !reflectionDone) {
      setReflectionOpen(true);
      return;
    }
    runActive();
  };

  const runActive = () => {
    if (!config.validate) {
      // Reflection-only mode: reflection already passed => success.
      pass();
      return;
    }
    const result = config.validate();
    onFeedback?.(result);
    if (result.passed) {
      pass();
    } else {
      toast.info(result.feedback || '还没对哦，再试试');
    }
  };

  const pass = () => {
    printCelebration('通关！已解锁修复说明与下一关。');
    toast.success('🎉 通关！');
    onPass();
  };

  return (
    <>
      <button type="button" className="btn btn--primary validate-btn" onClick={handleClick}>
        {label}
      </button>
      {reflectionOpen && config.reflection && (
        <ReflectionDialog
          question={config.reflection}
          onSuccess={() => {
            setReflectionOpen(false);
            setReflectionDone(true);
            // After reflection passes, proceed to active validation if any.
            if (config.validate) {
              runActive();
            } else {
              pass();
            }
          }}
          onClose={() => setReflectionOpen(false)}
        />
      )}
    </>
  );
}
