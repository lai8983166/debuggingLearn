# 关卡 7 修复说明：Memory 内存分析

## 错误现象

进入本关后浏览器内存持续增长；切换关卡再回来，泄漏会累计（最终浏览器变慢甚至崩溃）。

## 根因

`Scenario.tsx` 的 useEffect：

```ts
useEffect(() => {
  const sink: number[] = [];
  leakPool.push(sink);                          // [TEACHING_BUG] 模块级引用

  const onResize = () => { /* push 到 sink */ };
  window.addEventListener('resize', onResize);  // [TEACHING_BUG] 没 remove

  intervalRef.current = window.setInterval(...); // [TEACHING_BUG] 没 clear

  return () => {
    // 故意啥也不清理
  };
}, []);
```

三层泄漏：
1. **模块级 `leakPool` 数组** —— 永久持有 sink 引用
2. **window resize 监听器** —— 组件卸载后仍挂在 window 上
3. **setInterval 定时器** —— 组件卸载后仍每秒触发

## 修复

```ts
useEffect(() => {
  const sink: number[] = [];

  const onResize = () => { /* push */ };
  window.addEventListener('resize', onResize);

  const id = window.setInterval(() => { /* push */ }, 1000);

  return () => {
    window.removeEventListener('resize', onResize);
    window.clearInterval(id);
    // leakPool 不能在 cleanup 里清（它是模块级），所以根本不该用模块级。
    // 改用 useRef / 闭包变量，确保组件销毁后引用也消失。
  };
}, []);
```

## DevTools 技能收获

- Memory 面板三种模式：Heap snapshot / Allocation instrumentation / Allocation sampling
- **Heap snapshot**：某时刻所有 JS 对象
- **Comparison 视图**：两个快照之间的增量——定位泄漏最快的办法
- **Retainers**：显示"谁引用了这个对象"——这是定位泄漏根的关键
- 快捷技巧：在快照里按类名搜索（如 `leakPool`）

## 常见泄漏模式

- 定时器 / 监听器没在 useEffect cleanup 里清理
- 闭包持有大对象（onSnapshot 这类长连接）
- 全局 Map / Set 缓存永不淘汰
- Detached DOM：从文档移除但还有 JS 引用
- 第三方库实例没 destroy（地图、编辑器、播放器）
