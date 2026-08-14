/**
 * Lab 19 — CORS 跨域错误
 *
 * Scenario: fetch 一个不存在的跨域端点（example.invalid），浏览器真的会
 * 触发 CORS preflight 失败。Console 显示真实 CORS 错误。
 *
 * 验证：反思型（让学员选出根因）
 */

import { useState } from 'react';
import './Scenario.css';

export function CorsErrorsScenario() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClick = async () => {
    setStatus('loading');
    try {
      // [TEACHING_BUG] example.invalid 是不存在的域名，浏览器会触发 DNS 失败
      // 真实场景里换成 https://api.yourapp.com/... 没有 CORS header 的端点
      const res = await fetch('https://api.invalid.example.com/data');
      const data = await res.json();
      // eslint-disable-next-line no-console
      console.log('[App] got data:', data);
    } catch (e) {
      setStatus('failed');
      setErrorMsg(e instanceof Error ? e.message : String(e));
      // [TEACHING_BUG] 不打 console.error，让学员去 Console 看原始错误
    }
  };

  return (
    <div className="cors-lab">
      <h3>🌐 跨域请求</h3>
      <p className="cors-lab__lead">
        点按钮发起一个跨域请求。会失败。打开 Console 看 CORS 错误长什么样。
      </p>

      <button
        type="button"
        className="btn btn--primary"
        onClick={handleClick}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? '请求中…' : '发起跨域请求'}
      </button>

      {status === 'failed' && (
        <div className="cors-lab__err">
          <strong>请求失败：</strong>
          <code>{errorMsg}</code>
          <p>
            错误信息只有"Failed to fetch"——具体原因在 Console 里。打开 Console 看。
          </p>
        </div>
      )}

      <p className="cors-lab__hint">
        在 Console 看到带 <code>CORS</code> / <code>Access-Control-Allow-Origin</code> 字样的红色错误。
        Network 面板里也会有红色的失败请求。
      </p>
    </div>
  );
}
