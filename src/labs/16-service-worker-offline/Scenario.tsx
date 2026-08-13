/**
 * Lab 16 — Service Worker 离线缓存
 *
 * Scenario: 一个显示"当前版本"的页面。mount 时注册 /sw-lab.js，该 SW 用
 * cache-first 策略缓存了 /api/version 响应。学员点"模拟发布新版"按钮后，
 * 后端"新版本"是 v2.0.0，但页面仍显示 v1.0.0——因为 SW 不会重新请求。
 *
 * 修复路径：Application → Service Workers 子面板手动 Unregister；
 * 或 Application → Cache Storage 删除缓存条目。
 *
 * validate() 检查 navigator.serviceWorker.getRegistrations() 是否为空
 * （即学员已手动 unregister），加反思型确认理解 cache-first vs network-first。
 */

import { useEffect, useState } from 'react';
import './Scenario.css';

export function ServiceWorkerScenario() {
  const [version, setVersion] = useState<string>('loading…');
  const [serverVersion, setServerVersion] = useState('1.0.0');
  const [swRegistered, setSwRegistered] = useState(false);

  // Register the lab's SW on mount; unregister on unmount.
  useEffect(() => {
    let cancelled = false;
    async function setup() {
      if (!('serviceWorker' in navigator)) return;
      try {
        const reg = await navigator.serviceWorker.register('/sw-lab.js', { scope: '/' });
        if (!cancelled) setSwRegistered(!!reg);
        // Wait for the SW to be active, then fetch version
        await navigator.serviceWorker.ready;
      } catch {
        /* ignore */
      }
      if (!cancelled) refreshVersion();
    }
    void setup();

    return () => {
      cancelled = true;
      // Unregister on unmount so other labs aren't affected. We match by
      // checking the active/waiting/installing worker's scriptURL, since
      // ServiceWorkerRegistration itself only exposes scope.
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) =>
          Promise.all(
            regs
              .filter((r) => {
                const sw = r.active ?? r.waiting ?? r.installing;
                return !!sw?.scriptURL.includes('sw-lab');
              })
              .map((r) => r.unregister()),
          ),
        )
        .catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodically re-check SW registration status so validate() has fresh data
  useEffect(() => {
    const check = async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      const labReg = regs.find((r) => {
        const sw = r.active ?? r.waiting ?? r.installing;
        return !!sw?.scriptURL.includes('sw-lab');
      });
      setSwRegistered(!!labReg);
    };
    const id = window.setInterval(check, 1000);
    return () => window.clearInterval(id);
  }, []);

  const refreshVersion = async () => {
    try {
      const res = await fetch(`/api/version?v=${serverVersion}`);
      const data = (await res.json()) as { version: string };
      setVersion(data.version);
    } catch {
      setVersion('（请求失败）');
    }
  };

  const handlePublishNew = async () => {
    // Bump server-side version (in-memory only)
    const next = serverVersion === '1.0.0' ? '2.0.0' : '3.0.0';
    setServerVersion(next);
    // Wait a tick then re-fetch — but SW will return cached v1.0.0
    window.setTimeout(refreshVersion, 300);
  };

  return (
    <div className="sw">
      <h3>📦 离线版本</h3>
      <p className="sw__lead">
        页面显示当前应用版本。点"模拟发布新版"按钮发布新版——但页面会"看不到"更新，
        因为 Service Worker 缓存了旧版本。
      </p>

      <div className="sw__card">
        <div>
          当前显示版本：<strong className="sw__version">{version}</strong>
        </div>
        <div>
          后端最新版本：<strong>{serverVersion}</strong>
        </div>
        <div>
          SW 注册状态：<em>{swRegistered ? '已注册 ⚠️' : '未注册 ✓'}</em>
        </div>
      </div>

      <div className="sw__actions">
        <button type="button" className="btn btn--primary" onClick={handlePublishNew}>
          模拟发布新版（v{serverVersion === '1.0.0' ? '2.0.0' : '3.0.0'}）
        </button>
        <button type="button" className="btn" onClick={refreshVersion}>
          重新拉取版本
        </button>
      </div>

      <p className="sw__hint">
        点发布新版后，"当前显示"应该和"后端最新"不一致——这就是 SW 缓存 bug。
        打开 Application → Service Workers 手动 Unregister；再点"重新拉取"。
      </p>
    </div>
  );
}

// Export for guide.ts validate() to reference expected registration state
export function isServiceWorkerUnregistered(): boolean {
  // Synchronous check; the async state lives in component but we re-poll
  // here. We just look at the latest DOM label state.
  const em = document.querySelector('.sw__card em');
  return !!em?.textContent?.includes('未注册');
}
