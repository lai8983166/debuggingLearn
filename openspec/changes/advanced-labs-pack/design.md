## Context

在 v1 已建立的引导框架（Console + Tour + Validate + Hint 四通道）、关卡注册机制（`registry.ts` 单文件追加）、进度系统（versioned localStorage）之上，增加 8 个进阶关卡。v1 的架构对此扩展零摩擦——所有"新玩法"（多阶段验证、任务清单验证、纯效率关）都能在现有 `validate()` 函数内吸收，无需改框架。

约束：
- 不引入新 NPM 依赖（保持纯静态托管）
- v1 关卡的内容与行为不能破坏（向后兼容）
- v2 关卡难度整体高于 v1，但每关内部仍有梯度
- 部分 DevTools 能力（Lighthouse 跑分、Coverage、Device Mode）无法在页面 JS 内触发或检测，需要靠"反思型验证 + 截图引导"绕过

## Goals / Non-Goals

**Goals:**
- 8 个新关卡覆盖：Lighthouse、Coverage、Mobile、Web Vitals、异步竞态、Animations、Command Menu、Service Worker
- 每关沿用 v1 四通道引导，无新框架代码
- v2 第 1 关前置 `comprehensive`，链式解锁
- 反向测试保护所有 v2 教学 bug
- README 关卡地图扩展为 16 行
- 进度数据 0 改动兼容（v1 学员进度不丢）

**Non-Goals:**
- 不做"v1 跳级测试"（v3）
- 不做"自定义关卡导入"（v3）
- 不引入新的状态管理或路由变化
- 不重写 v1 的任何 Scenario/guide/FIX
- 不做后端真实化（MSW 继续承担）

## Decisions

### 1. "多阶段验证"用模块级计数器在 `validate()` 内实现

**场景**：`web-vitals` 一关埋 3 个 bug（LCP/CLS/INP），需要学员依次定位。

**方案**：guide.ts 的 `validate()` 函数闭包一个 `phase` 状态：

```ts
let phase = 0;
export const guide: LabGuideConfig = {
  validate: () => {
    if (phase === 0) {
      // 检查 LCP 相关 DOM/CSS 是否修复
      if (lcpFixed()) { phase = 1; return { passed: false, feedback: '✓ LCP 已修。继续看 CLS...' }; }
      return { passed: false, feedback: '先修 LCP：大图未设 width/height/loading' };
    }
    if (phase === 1) { /* CLS */ }
    if (phase === 2) { /* INP */ if (inpFixed()) return { passed: true, feedback: '' }; }
    return { passed: false, feedback: '...' };
  },
};
```

**理由**：现有 `validate()` 接口是黑盒，调用者只看 `{ passed, feedback }`。多阶段内部消化，框架无需感知。
**备选**：把 `web-vitals` 拆成 3 关。**否决**：3 个独立关卡对学员节奏过碎；单关三阶段更符合"真实 Web Vitals 调试都是一起看"的工作流。

### 2. "任务清单式验证"用于 `command-menu-snippets` 效率关

**场景**：这关没 bug，学员需要实际操作 10+ 个 DevTools 快捷操作（Cmd+K 打开菜单、Cmd+P 跳文件、Cmd+Shift+P 跑命令、Sources Snippets 创建并运行一段代码 等）。

**方案**：Scenario 内部维护一个 React state `tasks: boolean[]`，每个 task 通过页面侧可观测的行为标记完成。例如：
- Task "用 Snippets 运行一段代码"：监听 `window.__task_snippet_run` 全局变量（学员按引导在 Snippets 里粘贴的代码会 set 这个变量）
- Task "Console 输入 `document.title`"：监听 Console 输入需借助页面无法直接观测，改用"点页面按钮触发等价行为 + 反思型确认"组合

`validate()` 返回 `passed = tasks.every(Boolean)`。

**理由**：浏览器不暴露 DevTools 操作事件，无法直接观测学员"是否打开了 Command Menu"。所以分两类：
- **可观测的**（粘贴 snippet、点击结果）：主动型验证
- **不可观测的**（按 Cmd+K）：反思型验证（"我打开了" -> 单选"是/否"）

**备选**：纯反思型 10 道选择题。**否决**：效率关如果不动手就成了考试题，失去练习意义。

### 3. DevTools 内置能力（Lighthouse/Coverage/Device Mode）的引导策略

**约束**：这些面板无法从页面 JS 触发或读取结果。学员必须手动操作 DevTools。

**方案**：每关的 Tour 步骤嵌入**截图缩略图 + 简明操作步骤文字**，引导学员手动操作。验证一律用反思型单选（"你看到的 Lighthouse 性能分大致是多少？A: <30  B: 30-60  C: >60"），通过即通关。

**理由**：诚实地告诉学员"这关需要你手动跑，我们没法替你验证跑分"，反而符合真实工作流。
**备选**：跑分自动化（引入 puppeteer-replay）。**否决**：违背"纯静态无依赖"原则。

### 4. MSW 扩展为 `async-race-condition` 和 `service-worker-offline` 提供接口

**场景**：
- 异步竞态关：两个 tab 切换时，两个 fetch 同时在飞，慢的那个晚 resolve 覆盖快的
- Service Worker 关：需要 Service Worker 真的注册并拦截请求

**方案**：
- 异步竞态：MSW 加一个 `delay(1500)` 的 `/api/search?q=A` 和 `delay(200)` 的 `/api/search?q=B`，制造"晚发晚到覆盖"经典坑
- Service Worker：用 vite-plugin-pwa 太重；改成**仅在 service-worker 关卡页面 mount 时动态注册**一个内联 SW（用 Blob URL），unmount 时注销。保证其他页面不受影响

**备选（Service Worker）**：用 `caches` API 直接操作 Cache Storage，不真注册 SW。**否决**：学员在 Application 面板看不到 Service Workers 注册条目，破坏教学效果。

### 5. Web Vitals 三指标的页面侧观测

- **LCP**：用一个超大未优化的图片（base64 内联，~500KB）作 hero，故意不设 `width/height/loading="lazy"`。修复后学员应改成 `loading="lazy"` + 设尺寸
- **CLS**：图片占位用空 div，加载完成后才"撑开"——经典 CLS 坑
- **INP**：按钮 onClick 跑一个 500ms 的同步循环，点击响应明显延迟

每项配一个页面侧可观测的"修复后状态"用于主动型验证。

### 6. Animations 关与 Performance 关的区分

- v1 Performance 关：聚焦火焰图找瓶颈函数
- v2 Animations 关：聚焦 **Animations 面板的时间线视图**，修改 keyframes 的 easing/duration 现场验证

两者互补，不重复。

### 7. 关卡编号与文件夹命名

`src/labs/09-lighthouse-audit/` 到 `src/labs/16-service-worker-offline/`，保持 `NN-slug` 模式，registry.ts 数组顺序即解锁顺序。

## Risks / Trade-offs

- **[Lighthouse/Coverage 等无法自动验证]** → 反思型单选 + Console 鼓励学员"截图记录自己的分数"。学习者诚实作答即可。可接受。
- **[Web Vitals 多阶段验证状态不持久化]** → 刷新页面会从 phase=0 重新开始。**缓解**：FIX.md 提示学员"刷新会重置本关进度，建议一次完成"。可接受。
- **[Service Worker 注册在 dev server 下可能与 MSW 冲突]** → 两者都拦截 fetch。**缓解**：service-worker 关的 SW scope 限定到 `/labs/service-worker-offline/`（用相对路径 + `scope` 选项），MSW 仍处理其他路径。需要测试。
- **[Lighthouse 评分需要 https 或 localhost]** → 学员本地起 `npm run dev` 是 localhost，OK；部署到 GitHub Pages 是 https，OK。文档说明。
- **[Animations 关要求浏览器支持 Animations 面板]** → 所有现代 Chrome/Edge 都支持。Safari/Firefox 弱。**缓解**：README 注明"v2 推荐使用 Chrome 或 Edge"。
- **[v2 关卡内容可能比 v1 更难一次到位写好]** → **缓解**：每关先实现最小可玩版本（Scenario + 1 条 consoleHint + 1 个 tour step + 反思型 validate），跑通后再扩 hint 和 step。
- **[异步竞态在快机器上不易复现]** → 用 MSW `delay()` 强制制造 1500ms vs 200ms 的差异，保证任何机器都能看到覆盖。
- **[bundle 体积涨 ~80KB gzip]** → 可接受（v1 才 128KB，v2 总和 ~210KB）。后续可考虑动态 import 把 v2 关卡懒加载。

## Migration Plan

- **进度数据**：v1 的 `devtools-lab-progress-v1` schema 完全兼容 v2，无需迁移。学员的 `completed` 数组中的 v1 关卡 slug 仍然有效；v2 关卡自然新增为未解锁状态。
- **回滚**：v2 全部代码新增在 `src/labs/09-16/` 和 `registry.ts` 追加段，回滚只需 git revert 单个 commit。

## Open Questions

- Lighthouse 关是用一个"故意慢"的页面，还是用 v1 已有的 Performance 关卡页面？建议新建一个，因为 v1 Performance 关卡已经有 FPS 计数器等装饰，会分散 Lighthouse 评分注意力。
- Web Vitals 关是否应该展示一个"Web Vitals 实时数字"小部件（类似 v1 FpsMeter）？建议有，让学员直观看到 LCP/CLS/INP 数值。
- `command-menu-snippets` 关由于没 bug，通关后是否仍发徽章？建议发，徽章 = "效率达人"。
