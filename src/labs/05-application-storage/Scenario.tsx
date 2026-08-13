/**
 * Lab 5 — Application 存储排查
 *
 * Scenario: "记住我"登录。点登录后存 token 到 localStorage，但 key 名拼错，
 * 下次刷新读不到，登录态消失。学习者用 Application 面板看 localStorage 找根因。
 */

import { useEffect, useState } from 'react';
import './Scenario.css';

// 期望的 key
const EXPECTED_KEY = 'app.session.token';
// [TEACHING_BUG] 写入时用了一个拼错的 key
const WRONG_KEY = 'app.session.tokn';

export function ApplicationStorageScenario() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 读取用的是正确的 key——但写入用了错误的，所以读不到
    const stored = localStorage.getItem(EXPECTED_KEY);
    setToken(stored);
  }, []);

  const handleLogin = () => {
    const fakeToken = `tok_${Date.now()}`;
    // [TEACHING_BUG] 这里写入的 key 是错的（拼错）
    localStorage.setItem(WRONG_KEY, fakeToken);
    setToken(fakeToken); // 本次会话能显示，但刷新就丢
  };

  const handleLogout = () => {
    localStorage.removeItem(EXPECTED_KEY);
    // 由于实际存储 key 是 WRONG_KEY，这一行实际上没清掉，残留数据
    setToken(null);
  };

  return (
    <div className="session">
      <h3>🔐 登录态</h3>
      {token ? (
        <div className="session__state session__state--in">
          <p>
            当前已登录，欢迎你{username ? `，${username}` : ''}！token：
            <code>{token.slice(0, 16)}…</code>
          </p>
          <button type="button" className="btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      ) : (
        <div className="session__state session__state--out">
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="button" className="btn btn--primary" onClick={handleLogin}>
            登录（记住我）
          </button>
        </div>
      )}
      <p className="session__hint">
        点击"登录"，然后<strong>刷新页面</strong>。登录态会丢失。
        用 Application 面板的 Local Storage 看 <code>app.session.*</code> 有哪些 key。
      </p>
    </div>
  );
}
