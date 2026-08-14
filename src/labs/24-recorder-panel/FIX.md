# 关卡 24 修复说明：Recorder 面板

## Recorder 是什么

Chrome 117+ 内置的 **UI 流程录制器**。三个核心能力：

1. **录制**：捕获你在页面上的每一步（点击 / 输入 / 导航 / 滚动）
2. **回放**：一键重放整个流程（自动重新输入、点击）
3. **导出**：生成 Puppeteer / Playwright / WebdriverIO 脚本

本关无 bug——这是 v4 唯一的纯"工具技能"关。

## 完整工作流

```
录制 UI 流程 → 人工验证 → 导出脚本 → 加断言 → 进 CI
```

### 1. 录制

```
DevTools ⋮ → More tools → Recorder
→ Start new recording
→ 起名（如 signup-flow）
→ 在页面上操作
→ End recording
```

录制时 Recorder 自动生成**选择器**（优先 role / text / data-testid），比手写 CSS selector 更稳。

### 2. 回放

点 ▶ Replay。可用于：
- **回归验证**：改完代码重放关键流程
- **复现 bug**：让用户录下操作，开发者直接回放

### 3. 导出脚本

Export 菜单选格式。导出的 Puppeteer 脚本大致长这样：

```js
const puppeteer = require('puppeteer');

async function signupFlow() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://yourapp.com/signup');
  await page.type('[data-testid="rec-name"]', 'Alice');
  await page.click('[data-testid="rec-next1"]');
  await page.select('[data-testid="rec-plan"]', 'pro');
  await page.click('[data-testid="rec-next2"]');
  await page.click('[data-testid="rec-submit"]');

  await browser.close();
}
signupFlow();
```

**导出后要加断言**才能当测试用：

```js
// 加在最后
const text = await page.$eval('.rec__done', el => el.textContent);
assert(text.includes('Alice'), 'signup failed');
```

### 4. 进 CI

```yaml
# .github/workflows/e2e.yml
- run: npm i -D puppeteer
- run: node tests/e2e/signup-flow.js
```

## Recorder vs 手写 E2E

| | Recorder | 手写 Playwright |
| --- | --- | --- |
| 上手速度 | 分钟级 | 小时级 |
| 选择器质量 | 自动生成（优先语义化） | 手写（可能烂） |
| 断言 | 无（导出后手动加） | 随手写 |
| 维护 | 流程变了要重录 | 改一行 |
| 适合 | 冒烟测试 / 流程原型 / 复现 bug | 完整测试套件 |

**推荐策略**：Recorder 快速生成骨架 → 导出 Playwright → 手动加断言和数据驱动 → 进 CI。

## 相关：Performance 面板的录制 vs Recorder

- **Performance**：录制的是**运行时性能**（CPU / 渲染 / 内存时间线）
- **Recorder**：录制的是**用户操作**（点击 / 输入序列）

两者互补，不是一回事。

## DevTools 技能收获

- Recorder 面板的位置与基本操作
- 录制 / 回放 / 导出三件套
- 导出 Puppeteer / Playwright 脚本作为 E2E 起点
- `data-testid` 对选择器稳定性的价值（本关表单全用了）
