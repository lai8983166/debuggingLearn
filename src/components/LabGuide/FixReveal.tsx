/**
 * Reveals the lab's FIX.md (markdown) only after validation passes.
 *
 * Shown with a success banner and "下一关" CTA.
 */

import ReactMarkdown from 'react-markdown';
import type { Lab } from '@/labs/types';
import './FixReveal.css';

interface FixRevealProps {
  lab: Lab;
  nextLab: Lab | null;
  onNext: () => void;
}

export function FixReveal({ lab, nextLab, onNext }: FixRevealProps) {
  return (
    <div className="fix-reveal">
      <div className="fix-reveal__banner">
        <span className="fix-reveal__emoji">🎉</span>
        <div>
          <div className="fix-reveal__title">通关！</div>
          <div className="fix-reveal__sub">
            已颁发徽章：<strong>{lab.meta.badgeLabel}</strong>
          </div>
        </div>
      </div>
      <div className="fix-reveal__doc">
        <h3>修复说明</h3>
        <ReactMarkdown>{lab.fixDoc}</ReactMarkdown>
      </div>
      {nextLab && (
        <div className="fix-reveal__next">
          <button type="button" className="btn btn--primary" onClick={onNext}>
            前往下一关：{nextLab.meta.title} →
          </button>
        </div>
      )}
      {!nextLab && (
        <div className="fix-reveal__next fix-reveal__next--final">
          🏁 你已完成全部关卡！欢迎重玩任意关卡复习。
        </div>
      )}
    </div>
  );
}
