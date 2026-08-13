/**
 * Lab 7 — Memory 内存分析
 *
 * Scenario: 一个"事件订阅"组件，每次 mount 都给 window 注册一个监听器
 * 往一个大数组里 push 数据，且 unmount 时没清理定时器和监听器。
 * 进入/退出关卡多次后内存持续增长。学习者用 Memory 面板拍快照对比。
 */

import { useEffect, useRef } from 'react';
import './Scenario.css';

// 模块级"泄漏池"——故意挂在模块作用域，让 unmount 也不能回收
const leakPool: number[][] = [];

export function MemoryLeakScenario() {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const sink: number[] = [];
    leakPool.push(sink); // [TEACHING_BUG] 引用被永久持有

    const onResize = () => {
      // 每次窗口 resize 都往 sink 里 push 数据，且永不释放
      for (let i = 0; i < 1000; i++) sink.push(Math.random());
    };
    // [TEACHING_BUG] 注册了监听但没在 cleanup 里 removeEventListener
    window.addEventListener('resize', onResize);

    // [TEACHING_BUG] 定时器每秒 push 数据，cleanup 里没 clearInterval
    intervalRef.current = window.setInterval(() => {
      for (let i = 0; i < 5000; i++) sink.push(Math.random());
    }, 1000);

    return () => {
      // 故意啥也不清理——这就是泄漏
      // 应该写：
      //   window.removeEventListener('resize', onResize);
      //   clearInterval(intervalRef.current!);
    };
  }, []);

  // 主动触发泄漏（让任何机器都能在几秒内看到增长）
  const handleGrow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  return (
    <div className="leak">
      <h3>💧 内存泄漏演示</h3>
      <p className="leak__lead">
        本页面每秒向一个永不释放的数组 push 5000 个数字。停留越久内存越大。
        切换关卡再回来，泄漏会累计。
      </p>
      <button type="button" className="btn btn--primary" onClick={handleGrow}>
        手动触发一次泄漏
      </button>
      <p className="leak__hint">
        打开 Memory 面板 → Heap snapshot → Take snapshot。等几秒再拍第二张，
        选中第二张选 "Objects allocated between snapshot 1 and 2"，
        看 (array) 和 number 的数量增长。
      </p>
    </div>
  );
}
