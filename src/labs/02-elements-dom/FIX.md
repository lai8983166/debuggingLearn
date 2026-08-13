# 关卡 2 修复说明：Elements DOM/样式

## 错误现象

商品卡片竖向排列、顺序倒着、挤成一列，而不是横向网格。

## 根因

`Scenario.css` 里：

```css
.buggy-grid {
  /* [TEACHING_BUG] 应该是 row 但写成了 column-reverse */
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  /* 还少了 flex-wrap: wrap; */
}
```

- `flex-direction: column-reverse`：主轴变成垂直方向且反向，所以卡片竖排且倒序。
- 缺 `flex-wrap: wrap`：默认 `nowrap`，多卡片会溢出而不是换行。

## 修复

```css
.buggy-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
}
```

## 顺便修的另一个 bug

```tsx
{products.map((p, i) => (
  <article key={i}> ... </article>
))}
```

`key={i}` 用数组下标做 key 是反模式。增删时 React 会复用错误的 DOM，导致状态错位。
改成 `key={p.id}` 即可。

## DevTools 技能收获

- 右键 → 检查元素，DevTools 自动定位
- Elements 树快速向上找父容器
- **Computed** 子面板看最终生效值（区别于 Styles 看规则）
- **Styles** 子面板实时编辑样式验证假设，不用回代码改
