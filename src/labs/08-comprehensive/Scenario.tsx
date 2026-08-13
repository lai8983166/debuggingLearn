/**
 * Lab 8 — 综合多面板排查（结业）
 *
 * 一个"提交反馈"表单，提交后会偶发"失败"。
 * 真正的根因需要三步走：
 *   1. Console 有个 warning：payload 字段名不对
 *   2. Network 看请求：请求带了一个 undefined 字段，服务端拒收
 *   3. Sources 在 buildPayload 设断点，确认是 typo
 *
 * 验证分三阶段：每阶段对应一个面板的操作。
 */

import { useState } from 'react';
import './Scenario.css';

interface FeedbackPayload {
  message: string;
  rating: number;
  // 应该是 'contactEmail'，但代码里写错了
  contactMail?: string;
}

function buildPayload(message: string, rating: number, email: string): FeedbackPayload {
  // [TEACHING_BUG] 字段名拼错：服务端期望 contactEmail
  return {
    message,
    rating,
    contactMail: email,
  };
}

export function ComprehensiveScenario() {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'fail'>('idle');
  const [serverError, setServerError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setServerError('');

    const payload = buildPayload(message, rating, email);

    // 警告：payload 里有个字段名疑似不对（在 Console 给学习者线索）
    // eslint-disable-next-line no-console
    console.warn(
      '[App] 正在发送 payload:',
      payload,
      '（请检查字段名是否和服务端约定一致）',
    );

    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(() => setStatus('ok'))
      .catch((err) => {
        setStatus('fail');
        setServerError(err.message);
      });
  };

  return (
    <form className="feedback" onSubmit={handleSubmit}>
      <h3>📮 提交反馈</h3>
      <label>
        反馈内容
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="说点什么…"
          rows={3}
          required
        />
      </label>
      <label>
        评分
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
      <label>
        联系邮箱（可选）
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? '提交中…' : '提交'}
      </button>
      {status === 'ok' && (
        <p className="feedback__ok">提交成功！服务端收到了。</p>
      )}
      {status === 'fail' && (
        <p className="feedback__fail">提交失败：{serverError}</p>
      )}
      <p className="feedback__hint">
        提交后会失败。三个面板轮着用：Console → Network → Sources，最终在代码里找到 bug。
      </p>
    </form>
  );
}
