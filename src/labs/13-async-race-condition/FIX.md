# 关卡 13 修复说明：异步竞态条件

## 错误现象

快速输入 "A" 再输入 "B"：
1. B 的请求 200ms 后返回，UI 显示 B 的结果（正确）
2. A 的请求 1500ms 后返回，UI 被 A 覆盖（错误！学员此时输入是 B）

学员实际输入是 "B"，但看到的是 "A" 的结果。

## 根因

`Scenario.tsx`：

```ts
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((r) => r.json())
    .then((data) => {
      // [TEACHING_BUG] 没有"序号"或"取消"机制，晚到的旧请求会覆盖新结果
      setOutput(data);
    });
}, [query]);
```

fetch 不会因为新请求发出就取消旧的。两个请求各自跑各自的，谁晚 resolve 谁覆盖 UI。

## 修复方案（按推荐度排序）

### 1. AbortController（最干净，本关采用）

```ts
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setOutput)
    .catch((err) => {
      if (err.name === 'AbortError') return;  // 静默忽略
      console.error(err);
    });
  return () => controller.abort();  // cleanup 取消旧请求
}, [query]);
```

每次 effect 重跑前先 abort 旧的 fetch。Promise 会 reject 一个 `AbortError`，catch 里判断跳过。

### 2. 请求序号（兼容老浏览器）

```ts
const serialRef = useRef(0);
useEffect(() => {
  const mySerial = ++serialRef.current;
  fetch(...)
    .then(...)
    .then((data) => {
      if (mySerial !== serialRef.current) return;  // 我已经不是最新请求了
      setOutput(data);
    });
}, [query]);
```

逻辑简单，但旧请求依然会跑完（浪费带宽和 CPU）。AbortController 优势是真正中止。

### 3. Debounce（治标）

```ts
const debouncedQuery = useDebounce(query, 300);
useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);
```

300ms 防抖能减少竞态发生概率，但慢网络下还是会出问题。治标不治本。

### 4. React Query / SWR / RTK Query

生产项目里直接用 React Query 之类的库——它们内置了竞态处理、缓存、去重等所有逻辑。

```ts
const { data } = useQuery(['search', query], () => fetchSearch(query));
// 自动处理竞态、缓存、去重、stale-while-revalidate
```

## 进阶：异步堆栈

DevTools 默认会显示同步调用栈。但 fetch → Promise → 真正的调用者这种异步链路默认看不到。

开启 "Async Stack Traces"：
- DevTools Settings（齿轮图标）→ Preferences → 在 Console 或 Sources 启用
- 或 Settings → Experiments → "Async stack traces"

开启后断点暂停时，Call Stack 会显示完整的异步调用链——非常有助于调试 Promise 链。

## 同类典型坑

- 表单自动保存：用户连点几下，旧请求覆盖新数据
- 路由切换：上一页的 fetch 在新页才 resolve，setState 报警告
- WebSocket 重连：旧连接的 message 流到新 handler
- 多 tab 同步：localStorage 事件触发多个 handler 竞争

## DevTools 技能收获

- Sources 异步堆栈（需要手动开启）
- Network 时序图判断请求先后顺序
- Console 配合日志看请求生命周期
- AbortController 的 Promise 行为（reject AbortError）
