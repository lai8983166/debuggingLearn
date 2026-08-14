# 关卡 23 修复说明：React DevTools

## 错误现象

父组件每次 tick +1，三张 HeavyCard 全部重新渲染——即使它们的 props（label）完全没变。渲染开销随卡片数量线性增长。

## 根因

```tsx
function HeavyCard({ label }: { label: string }) { ... }

// 父组件
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <HeavyCard label="指标A" />  {/* 没有 memo：父渲染 → 子必然渲染 */}
      <HeavyCard label="指标B" />
    </>
  );
}
```

React 默认行为：**父组件重渲染 → 所有子组件重渲染**（不管 props 是否变化）。

## 修复：React.memo

```tsx
const MemoHeavyCard = memo(HeavyCard);

// props 浅比较相同 → 跳过渲染
<MemoHeavyCard label="指标A" />
```

`memo` 对 props 做浅比较（`Object.is`），相同就返回缓存的元素，跳过整棵子树的渲染。

### memo 的坑

```tsx
// ❌ 每次渲染都创建新对象/函数 → 浅比较永远不等 → memo 无效
<MemoCard config={{ theme: 'dark' }} onClick={() => doSomething()} />

// ✅ 用 useMemo / useCallback 稳定引用
const config = useMemo(() => ({ theme: 'dark' }), []);
const handleClick = useCallback(() => doSomething(), []);
<MemoCard config={config} onClick={handleClick} />
```

## React DevTools 核心功能

### Components 面板

- 左侧组件树（可折叠）
- 点任意组件 → 右侧显示 props / hooks state / context
- **实时编辑 props** 双击值直接改（不用改代码）
- ⚙ 里勾 "Highlight updates" → 渲染的组件被彩色边框圈出

### Profiler 面板

1. 点 ● 开始录制
2. 操作页面（点击 / 输入）
3. 停止 → 出现 commit 时间线（每次渲染一个竖条）
4. 点某个 commit：
   - **火焰图**：条越宽渲染越贵；灰色 = 跳过，彩色 = 渲染了
   - **Ranked 图**：按耗时排序
5. "Why did this render?" 需在设置里开启 —— 显示每次渲染的原因（props 变了 / state 变了 / 父渲染）

## 诊断 re-render 的 checklist

1. Profiler 录制 → 找彩色（渲染了）但本不该渲染的组件
2. 开 "Why did this render" 看原因
3. 对症下药：
   - props 引用不稳定 → useMemo/useCallback
   - 子树真的没必要 → React.memo
   - state 放错位置（太顶层）→ 状态下移
   - context 值未 memo → `useMemo` 包 context value

## DevTools 技能收获

- React DevTools 扩展的安装与 Components / Profiler 面板
- Profiler 火焰图：灰色 vs 彩色的含义
- "Highlight updates" 可视化渲染
- React.memo 与浅比较陷阱
