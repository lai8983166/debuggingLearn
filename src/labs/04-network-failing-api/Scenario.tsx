/**
 * Lab 4 — Network 请求排查
 *
 * Scenario: 文章列表加载，但 fetch 把错误吞了（catch 后不显示任何提示），
 * 页面"看起来没问题但就是没数据"。学习者用 Network 面板观察请求详情。
 */

import { useEffect, useState } from 'react';
import './Scenario.css';

interface Article {
  id: number;
  title: string;
  excerpt: string;
}

export function NetworkFailingApiScenario() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/articles')
      .then((res) => {
        if (!res.ok) {
          // [TEACHING_BUG] 非 2xx 状态码不抛错；fetch 不会因 4xx/5xx 自动 reject。
          // 正确做法：throw new Error(`HTTP ${res.status}`) 或检查 res.ok 后处理。
          return [] as Article[];
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch(() => {
        // [TEACHING_BUG] 静默吞掉错误：不 setState 也不上报
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="articles">
      <h3>📚 最新文章</h3>
      {loading ? (
        <p className="articles__loading">加载中…</p>
      ) : articles.length === 0 ? (
        <p className="articles__empty">这里什么都没有。是真没数据，还是请求失败了？</p>
      ) : (
        <ul className="articles__list">
          {articles.map((a) => (
            <li key={a.id}>
              <h4>{a.title}</h4>
              <p>{a.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="articles__hint">
        打开 Network 面板，刷新页面，找到 <code>/api/articles</code> 请求看 Status。
      </p>
    </div>
  );
}
