/**
 * Lab 24 — Recorder 面板
 *
 * Scenario: 一个多步表单（填姓名 → 选计划 → 提交）。
 * 学员用 DevTools Recorder 面板（Chrome 117+）录制整个流程，
 * 回放验证，导出 Puppeteer 脚本做 E2E 回归。
 */

import { useState } from 'react';
import './Scenario.css';

export function RecorderPanelScenario() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rec">
      <h3>🎬 Recorder：录制 UI 流程</h3>
      <p className="rec__lead">
        Recorder 面板（Chrome 117+ 内置）能录制你在页面上的操作（点击/输入/导航），
        保存成流程，随时回放，还能导出成 Puppeteer / Playwright / WebdriverIO 脚本。
      </p>

      <div className="rec__progress">步骤 {step + 1} / 3</div>

      {step === 0 && (
        <div className="rec__step">
          <label>
            姓名
            <input
              data-testid="rec-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入你的名字"
            />
          </label>
          <button
            type="button"
            data-testid="rec-next1"
            className="btn btn--primary"
            disabled={!name}
            onClick={() => setStep(1)}
          >
            下一步
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rec__step">
          <label>
            选择计划
            <select data-testid="rec-plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="">请选择</option>
              <option value="free">免费版</option>
              <option value="pro">专业版</option>
            </select>
          </label>
          <button
            type="button"
            data-testid="rec-next2"
            className="btn btn--primary"
            disabled={!plan}
            onClick={() => setStep(2)}
          >
            下一步
          </button>
        </div>
      )}

      {step === 2 && !submitted && (
        <div className="rec__step">
          <p>
            确认：<strong>{name}</strong> / {plan}
          </p>
          <button
            type="button"
            data-testid="rec-submit"
            className="btn btn--primary"
            onClick={() => setSubmitted(true)}
          >
            提交
          </button>
        </div>
      )}

      {submitted && (
        <div className="rec__done">
          ✓ 注册完成！欢迎你，<strong>{name}</strong>
        </div>
      )}

      <p className="rec__hint">
        打开 Recorder：DevTools 右上 ⋮ → More tools → Recorder（或 Cmd+Shift+P 搜
        "Show Recorder"）。点 "Start new recording" → 起个名 → 走完这个表单 → 停止。
        然后点 ▶ Replay 回放整个流程。
      </p>
    </div>
  );
}
