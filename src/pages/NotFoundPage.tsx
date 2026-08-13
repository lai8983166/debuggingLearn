import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-dim)' }}>
      <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
      <p>页面不存在。</p>
      <Link to="/">← 回首页</Link>
    </div>
  );
}
