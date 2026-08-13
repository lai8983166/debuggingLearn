/**
 * Lab 6 — Performance 性能分析
 *
 * Scenario: 一个"滚动字幕"动画，因为每帧都在主线程做大量同步计算（O(n) 遍历
 * 大数组），导致掉帧。学习者用 Performance 面板录制，找到瓶颈函数。
 *
 * 注意：故意把"重计算"做得足够慢，让任何机器都能看到掉帧（30 fps 以下）。
 */

import { useEffect, useRef, useState } from 'react';
import { FpsMeter } from '@/components/FpsMeter';
import './Scenario.css';

// 一个会让主线程忙一会儿的纯计算函数
function expensiveComputation(iterations: number): number {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    // 故意做点浮点运算让 CPU 真的忙
    result += Math.sin(i) * Math.cos(i / 2);
  }
  return result;
}

export function PerformanceJankScenario() {
  const [position, setPosition] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    const animate = () => {
      // [TEACHING_BUG] 每帧执行 300k 次浮点运算——主线程被堵
      expensiveComputation(300_000);
      const elapsed = performance.now() - startRef.current;
      // 横向往返
      const x = Math.abs((elapsed / 30) % 200 - 100);
      setPosition(x);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="perf">
      <FpsMeter />
      <h3>🎨 滚动动画</h3>
      <p className="perf__lead">
        看右上的 FPS 数字（应该在 60 以下跳动）。这个动画本该丝滑，但每帧都卡。
      </p>
      <div className="perf__stage">
        <div className="perf__ball" style={{ transform: `translateX(${position}px)` }}>
          🏀
        </div>
      </div>
      <p className="perf__hint">
        打开 Performance 面板，点 ● Record 录制 3 秒，停止后看 Main 线程的火焰图，
        找占据大部分时间的函数名。
      </p>
    </div>
  );
}
