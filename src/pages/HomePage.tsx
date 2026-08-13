import { Link } from 'react-router-dom';
import { useProgressStore } from '@/store/progressStore';
import { getAllLabs } from '@/labs/registry';
import './HomePage.css';

export function HomePage() {
  const completed = useProgressStore((s) => s.completed);
  const reset = useProgressStore((s) => s.reset);
  const exportProgress = useProgressStore((s) => s.exportProgress);
  const total = getAllLabs().length;
  const hasProgress = completed.length > 0;

  const handleExport = () => {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devtools-lab-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('确定清除所有进度？此操作不可撤销。')) {
      reset();
    }
  };

  return (
    <div className="home">
      <section className="home__hero">
        <h1>🛠 DevTools 教学实验室</h1>
        <p className="home__lead">
          在一个故意带 bug 的真实前端项目里，练习用浏览器 DevTools 定位、验证、修复问题。
          每关独立、可中断，Console / Elements / Sources / Network / Performance / Memory /
          Application 全覆盖。
        </p>
        <div className="home__cta">
          <Link to="/labs" className="btn btn--primary">
            {hasProgress ? '继续学习 →' : '开始学习 →'}
          </Link>
        </div>
        {hasProgress && (
          <p className="home__progress">
            当前进度：<strong>{completed.length}</strong> / {total} 关
          </p>
        )}
      </section>

      <section className="home__features">
        <div className="home__feature card">
          <h3>多通道引导</h3>
          <p>Console 自动提示 + 步骤浮窗 + 答案验证 + 分级文字提示，按你习惯的方式学。</p>
        </div>
        <div className="home__feature card">
          <h3>真实代码、真实 bug</h3>
          <p>每关都是一段会"真的出问题"的前端代码，bug 用 <code>[TEACHING_BUG]</code> 在源码里标记。</p>
        </div>
        <div className="home__feature card">
          <h3>进度持久化</h3>
          <p>通关颁发徽章、解锁下一关；进度存在本地，刷新不丢。</p>
        </div>
      </section>

      {hasProgress && (
        <section className="home__settings">
          <h3>我的进度</h3>
          <div className="home__settings-actions">
            <button type="button" className="btn" onClick={handleExport}>
              导出进度
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleReset}>
              重置进度
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
