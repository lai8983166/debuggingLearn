# 🛠 DevTools 教学实验室

一个面向前端开发者的浏览器 DevTools 教学平台。每关都是一段**故意带 bug** 的真实前端代码，你需要打开 DevTools、定位问题、验证修复。

> 完全前端、零后端依赖。可托管到任意静态站点。

## 关卡地图

| # | 关卡 | 训练的 DevTools 面板 | 难度 | 前置 |
| --- | --- | --- | --- | --- |
| 1 | 消失的点击 | Console | ★☆☆ | — |
| 2 | 乱序的卡片 | Elements | ★☆☆ | 1 |
| 3 | 翻倍的购物车 | Sources | ★★☆ | 2 |
| 4 | 安静的文章列表 | Network | ★★☆ | 3 |
| 5 | 消失的登录态 | Application | ★★☆ | 4 |
| 6 | 卡顿的动画 | Performance | ★★★ | 5 |
| 7 | 越来越卡的页面 | Memory | ★★★ | 6 |
| 8 | 结业：失败的提交 | 综合 | ★★★ | 7 |

建议按顺序通关——每关解锁下一关。

## 引导：四个通道，任选其一

每个关卡都同时提供：

1. **Console 引导** — 打开 Console 自动看到 `[Lab]` 开头的彩色提示
2. **步骤浮窗（Step Tour）** — 右下角浮窗，可上一步/下一步，必要时高亮页面元素
3. **答案验证** — 点"检查答案"按钮自动判定；部分关卡支持反思型（单选根因）
4. **分级提示** — 渐进式文字提示作为兜底

老师投屏讲解时加 `?presentation=1` 隐藏浮窗和提示，仅保留 Console 引导。

## 本地启动

```bash
npm install
npm run dev
```

打开 http://localhost:5173 即可。

> Network 关卡用 MSW（Mock Service Worker）拦截请求。仅 dev 模式启用——生产构建会回退到真实 fetch，请求会失败（也是练习的一部分）。

## 构建与预览

```bash
npm run build       # 产物在 dist/
npm run preview     # 本地预览生产产物
```

## 测试

```bash
npm test            # 全部单元测试
npm run test:bugs   # 仅反向测试（保护教学 bug 不被误改）
npm run lint
```

## 部署到 GitHub Pages

仓库已带 `.github/workflows/deploy.yml`：push 到 `main` 自动构建并发布到 `gh-pages` 分支。

需要确认仓库 Settings → Pages → Source 指向 `gh-pages` 分支根目录。

如要部署到子路径（默认假设仓库名是 `devtools-teaching-lab`），通过环境变量覆盖：

```bash
VITE_BASE_PATH=/your-repo/ npm run build
```

## 新增关卡

1. 复制 `src/labs/01-console-errors/` 作为模板
2. 改 `Scenario.tsx`（含 bug）、`guide.ts`（引导配置）、`FIX.md`（修复说明）、`index.ts`（meta）
3. 在 `src/labs/registry.ts` 数组里追加 import + 注册一行
4. 在 `src/labs/teaching-bugs.test.ts` 加一条反向测试，断言该 bug 还在

**所有教学 bug 必须用 `// [TEACHING_BUG]` 注释标注**。这样：
- 代码评审能立刻看出"这是故意的"
- 反向测试能用 grep 找到这些位置

## 目录结构

```
src/
├── main.tsx              # 入口（启用 MSW）
├── routes/router.tsx     # 路由配置
├── pages/                # 页面：Home / LabsIndex / Lab / 404
├── components/           # AppShell / ProgressBar / BadgeGrid / Toast / FpsMeter / LabGuide/
├── labs/                 # 8 个关卡 + registry + 反向测试
│   ├── 01-console-errors/
│   ├── 02-elements-dom/
│   ├── ...
│   ├── registry.ts
│   ├── types.ts
│   └── teaching-bugs.test.ts
├── store/progressStore.ts # 进度状态（Zustand + persist）
├── lib/consoleGuide.ts   # Console 引导工具
├── mocks/                # MSW 配置
└── styles/global.css
```

## 技术栈

- Vite + React 18 + TypeScript（严格模式）
- React Router v6（路由）
- Zustand + persist 中间件（进度状态）
- MSW（Network 关卡的 mock）
- Vitest（单元 + 反向测试）
- ESLint 自定义规则：发现 `[TEACHING_BUG]` 标记自动告警

## 进度数据

进度存在浏览器 `localStorage` 的 `devtools-lab-progress-v1`：
- 已通关的 slug 列表
- 已获徽章
- 当前所在关卡（用于恢复）
- 数据版本号

首页提供"导出进度"（下载 JSON）和"重置进度"（二次确认）。

## License

MIT
