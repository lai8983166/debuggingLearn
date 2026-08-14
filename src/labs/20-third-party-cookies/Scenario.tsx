/**
 * Lab 20 — 第三方 Cookie / SameSite
 *
 * Scenario: 设置一个 SameSite=Lax 的 cookie，模拟某些场景下"登录态丢失"。
 * 学员在 Application → Cookies 看 SameSite 字段。
 */

import { useEffect, useState } from 'react';
import './Scenario.css';

// [TEACHING_BUG] SameSite=Lax 是默认值，但某些跨页跳转场景会丢 cookie
// （比如从邮件链接直接跳到 /checkout）
document.cookie = 'app_session=lax_session_value; SameSite=Lax; path=/; max-age=3600';

export function ThirdPartyCookiesScenario() {
  const [currentCookie, setCurrentCookie] = useState('');

  useEffect(() => {
    // 读 cookie
    const match = document.cookie.match(/app_session=([^;]+)/);
    setCurrentCookie(match?.[1] ?? '(无)');
  }, []);

  const reload = () => window.location.reload();

  return (
    <div className="tpc-lab">
      <h3>🍪 Cookie 与 SameSite</h3>
      <p className="tpc-lab__lead">
        本页面设置了一个 <code>SameSite=Lax</code> 的 cookie。
        Lax 在多数场景下 OK，但某些跨页跳转（如从邮件链接直接进来）会丢。
      </p>

      <div className="tpc-lab__status">
        <div>
          <strong>当前 cookie：</strong>
          <code>{currentCookie}</code>
        </div>
      </div>

      <p className="tpc-lab__hint">
        打开 Application → Cookies → 当前域名。看 <code>app_session</code> 的 SameSite 列。
        如果改成 <code>SameSite=None; Secure</code>，跨页场景才能稳定保留（但需要 HTTPS）。
      </p>

      <button type="button" className="btn" onClick={reload}>
        重新加载本页面（看 cookie 是否保留）
      </button>
    </div>
  );
}
