# 关卡 3 修复说明：Sources 断点调试

## 错误现象

T 恤 ¥50 × 2 + 帽子 ¥30 × 1 应该是 ¥130，但页面显示 ¥260（恰好是期望值的 2 倍）。

## 根因

`Scenario.tsx` 的 `computeTotal`：

```ts
function computeTotal(cart: CartItem[]): number {
  let total = 0;
  for (const item of cart) {
    // [TEACHING_BUG] 这里多乘了 2，让总价翻倍
    total += item.unitPrice * item.qty * 2;
  }
  return total;
}
```

`* 2` 是错误的——很可能是从一段"促销：满 2 件打 5 折"的旧代码误抄过来，但 5 折是 `* 0.5` 不是 `* 2`，且该逻辑不该套用在这里。

## 修复

```ts
total += item.unitPrice * item.qty;
```

## DevTools 技能收获

- Sources 面板用 Cmd/Ctrl+P 快速跳文件
- 在行号上点击设置断点
- **Scope** 面板看局部/闭包/全局变量的实时值
- 鼠标悬停在源码变量上也能看值（无需手动 console.log）
- 工具栏 Step over (F10) / Step into (F11) / Continue (F8)

## 进阶技巧

- **条件断点**：右键行号 → "Add conditional breakpoint"，写 `item.id === 1` 只在特定情况暂停
- **日志点 (Logpoint)**：右键行号 → "Add logpoint"，无需改代码就能 console.log
- **Watch** 面板：把表达式钉住，每次暂停自动重算
