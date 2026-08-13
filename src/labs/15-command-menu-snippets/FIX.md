# 关卡 15 速查表：DevTools 快捷键 & Snippets

## 全局 / DevTools 内

| 快捷键 | 作用 |
| --- | --- |
| `F12` / `Cmd+Opt+I` | 打开 DevTools |
| `Cmd+K` / `Ctrl+K` | DevTools 内全局搜索（Command Menu） |
| `Cmd+Shift+D` | 循环切换 Dock 位置（右/下/左/独立） |
| `Cmd+[` / `Cmd+]` | 切换 DevTools 面板（左右） |
| `Esc` | 打开/关闭 Console Drawer |
| `Cmd+,` | DevTools Settings |
| `Cmd+Shift+P` | "Run command"（同 Command Menu 选 Run 模式） |

## Sources

| 快捷键 | 作用 |
| --- | --- |
| `Cmd+P` / `Ctrl+P` | 跳文件（按名字模糊搜） |
| `Cmd+G` / `Ctrl+G` | 跳行号 |
| `Cmd+F` | 文件内搜索 |
| `Cmd+Shift+F` | 全工程搜索（"全局搜代码"） |
| `Cmd+B` | 切换断点（在当前行） |
| `F8` | Continue（暂停后继续） |
| `F10` | Step over（不进入函数） |
| `F11` | Step into（进入函数） |
| `Shift+F11` | Step out（跳出当前函数） |

## Console

| 快捷键 | 作用 |
| --- | --- |
| `Cmd+L` / `Ctrl+L` | 清空 Console |
| `$_` | 上一条表达式的值 |
| `$0` | Elements 最后选中的元素 |
| `$$('.cls')` | `querySelectorAll` 简写 |
| `$x('//div')` | XPath 查询 |
| `Cmd+Up` | 复制上一条到当前输入 |
| `keys(obj)` | Object.keys 包装 |
| `values(obj)` | Object.values 包装 |
| `copy(...)` | 复制到剪贴板 |
| `monitorEvents(el)` | 监听元素事件 |

## Elements

| 快捷键 | 作用 |
| --- | --- |
| `H` | 隐藏当前元素（visibility 切换） |
| `F2` | 进入编辑文本模式 |
| 双击属性 | 编辑属性 |
| `Cmd+Z` | 撤销修改 |
| 上下方向键 | 在 DOM 树移动 |
| 右键元素 → Scroll into view | 滚动到该元素 |

## Network

| 快捷键 | 作用 |
| --- | --- |
| `Cmd+R`（Network 面板下） | 刷新并记录 |
| 右键请求 → Copy as fetch | 复制为 fetch 代码 |
| 右键请求 → Copy as cURL | 复制为 cURL 命令 |
| 右键请求 → Replay XHR | 不刷新重发 |
| 右键请求 → Block request URL | 屏蔽该请求 |

## Snippets 推荐代码片段

```js
// 1. 打印所有 cookie + localStorage 概览
console.log('Cookies:', document.cookie);
console.log('localStorage:', Object.fromEntries(Object.entries(localStorage)));

// 2. 格式化粘贴板里的压缩 JSON
copy(JSON.stringify(JSON.parse(await navigator.clipboard.readText()), null, 2));

// 3. 高亮所有没有 alt 的图片
$$('img').forEach(img => {
  if (!img.alt) img.style.outline = '3px solid red';
});

// 4. 找所有按钮的可点击文本（用于 a11y 检查）
$$('button').map(b => b.textContent?.trim()).filter(Boolean);

// 5. 性能：测量一段代码耗时
const t0 = performance.now();
/* 你的代码 */
console.log(`${performance.now() - t0}ms`);
```

## DevTools 技能收获

- Command Menu 是 DevTools 的" Spotlight / Alfred"——记住 Cmd+K
- Sources Snippets 让你不用切到代码也能跑调试片段
- `$0` / `$_` / `$$` 是 Console 调试三件套
- Block / Replay / Copy as 让 Network 调试效率翻倍
