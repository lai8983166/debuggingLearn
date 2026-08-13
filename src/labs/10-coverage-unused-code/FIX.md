# 关卡 10 修复说明：Coverage 死代码分析

## Coverage 面板是干什么的

记录页面加载/交互时**实际执行的 JS/CSS 字节**，红色 = 未执行，绿色 = 已执行。
是定位"首屏性能浪费"的最直观工具。

## 本关的扣分项

`Scenario.tsx` 故意塞了三块未使用代码：

```ts
// 1. 大数组：5000 个字符串，约 200KB
const BIG_UNUSED_ARRAY = Array.from({ length: 5000 }, ...);

// 2. 工具函数集：4 个定义但首屏不调用
export const unusedUtils = {
  formatPrice, parseQuery, debounce, chunk, getSize
};

// 3. 隐藏的调试链接：勉强引用了一下避免 tree-shake
```

首屏只会执行 `sayHi` 一个函数，其余 90%+ 字节都是浪费。

## 修复方向（按性价比排序）

### 1. Tree Shaking（最简单）

确保 `package.json` 有 `"sideEffects": false` 或 `"sideEffects": ["*.css"]`，
让打包器删除未引用的导出：

```json
{
  "sideEffects": ["*.css"]
}
```

### 2. Code Splitting（动态 import）

```ts
// 路由级
const AdminPage = lazy(() => import('./AdminPage'));

// 交互级（点开"高级搜索"才加载）
button.onclick = async () => {
  const { advancedSearch } = await import('./advanced-search');
  advancedSearch();
};
```

### 3. 按需引入库

```ts
// ❌ 全量引入
import _ from 'lodash';
_.debounce(fn, 100);

// ✅ 按需引入
import debounce from 'lodash/debounce';
debounce(fn, 100);
```

### 4. 删除真死代码

Coverage 找出的红色代码，如果确认没人用——直接删掉，最干净。

## 工业级用法

- **CI 集成**：用 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) 持续监控 unused bytes 比例
- **Bundle 分析**：webpack-bundle-analyzer / source-map-explorer / Vite 的 `--mode production --analyze`
- **Polyfill 瘦身**：用 `@babel/preset-env` + `useBuiltIns: 'usage'` + browserslist 控制目标

## DevTools 技能收获

- Command Menu（Cmd+Shift+P）的强大——DevTools 几乎所有功能都能从这里搜
- Coverage 面板的 reload instrumentation 流程
- 红绿源码视图定位未使用代码
