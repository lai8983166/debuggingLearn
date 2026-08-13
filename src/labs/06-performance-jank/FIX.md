# 关卡 6 修复说明：Performance 性能分析

## 错误现象

🏀 球的动画卡顿，右上 FPS 计数器显示明显低于 60。

## 根因

`Scenario.tsx`：

```ts
function expensiveComputation(iterations: number): number {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sin(i) * Math.cos(i / 2);
  }
  return result;
}

useEffect(() => {
  const animate = () => {
    // [TEACHING_BUG] 每帧跑 30 万次浮点运算 —— 主线程被堵
    expensiveComputation(300_000);
    setPosition(...);
    requestAnimationFrame(animate);
  };
}, []);
```

每一帧（理论上 16ms）都跑一次重计算，单帧耗时就超过 16ms，导致掉帧。
更糟糕的是：`expensiveComputation` 的返回值根本没被使用——纯浪费。

## 修复方向（按性价比排序）

1. **直接删掉无用的计算**——它的返回值没被用到。
2. **降低频率/缓存**——如果真的需要计算，移到 effect 外，只在依赖变化时跑。
3. **拆帧**——拆成多份，分多帧完成（用 `requestIdleCallback` 或自己分批）。
4. **移到 Worker**——CPU 密集任务放到 Web Worker，主线程保持流畅。

```ts
// 修复后
const animate = () => {
  const elapsed = performance.now() - startRef.current;
  const x = Math.abs((elapsed / 30) % 200 - 100);
  setPosition(x);
  requestAnimationFrame(animate);
};
```

## DevTools 技能收获

- Performance 面板 Record/Stop 录制主线程活动
- **Main** 时间轴的火焰图：宽度 = 函数耗时
- **Bottom-Up** 视图按 "Self Time" 找最耗时函数
- 颜色：黄色脚本 / 紫色布局重排 / 绿色绘制
- "Network" 行看请求瀑布，"GPU" 行看硬件加速情况

## 进阶

- **CPU 4× slowdown**：录制前选 CPU throttle，模拟低端机
- **Lighthouse**：旁边的 Audits 面板可以跑综合性能评分
- **Recalculate Style** 频繁出现？多半是 CSS 选择器太复杂或 DOM 太大
