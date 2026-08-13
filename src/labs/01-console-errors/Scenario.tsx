/**
 * Lab 1 — Console 报错排查
 *
 * Scenario: 一个简单的"登录"表单。点击按钮时，由于访问 undefined 的属性，
 * 会抛出运行时错误。学习者打开 Console 就能看到红色错误堆栈。
 *
 * 故意埋的 bug：onClick handler 直接读了 `config.endpoint` 但 `config`
 * 在某条分支里可能为 undefined（这里直接置 undefined 模拟"忘传配置"）。
 */

import { useState } from 'react';
import './Scenario.css';

// [TEACHING_BUG] 模拟"漏传配置"——config 实际为 undefined，但 handler 假设它存在。
const config = undefined as unknown as { endpoint: string };

export function ConsoleErrorsScenario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // [TEACHING_BUG] config 为 undefined，下一行会抛 "Cannot read properties of undefined (reading 'endpoint')"
    const endpoint = config.endpoint;

    // 以下代码不会执行，因为上一行抛错。
    fetch(endpoint, { method: 'POST', body: JSON.stringify({ email, password }) })
      .then(() => setStatus('done'))
      .catch(() => setStatus('idle'));
  };

  return (
    <form className="scenario scenario--form" onSubmit={handleSubmit}>
      <h3>登录到账户</h3>
      <label>
        邮箱
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <label>
        密码
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? '登录中…' : status === 'done' ? '已登录 ✓' : '登录'}
      </button>
      <p className="scenario--form__hint">
        提示：点击"登录"按钮，观察页面什么也没发生。打开 Console 看看为什么。
      </p>
    </form>
  );
}
