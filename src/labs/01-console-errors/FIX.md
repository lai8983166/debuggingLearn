# 关卡 1 修复说明：Console 报错排查

## 错误信息
```
TypeError: Cannot read properties of undefined (reading 'endpoint')
```

## 根因

`Scenario.tsx` 里：

```ts
const config = undefined as unknown as { endpoint: string };

const handleSubmit = (e) => {
  // ...
  const endpoint = config.endpoint; // ← 这里崩溃
};
```

`config` 被强制断言成 `{ endpoint: string }` 类型，但运行时它就是 `undefined`。
TypeScript 的类型断言不会改变运行时值，只是骗过编译器。

## 真实项目里的对应场景

- 后端把配置注入 `window.__CONFIG__`，但某个环境下漏注入了
- `.env` 变量名拼错，`import.meta.env.API_URL` 拿到 `undefined`
- 异步初始化没完成就调用 `app.config.endpoint`

## 修复思路

```ts
if (!config?.endpoint) {
  throw new Error('配置缺失：endpoint 未定义');
}
fetch(config.endpoint, ...);
```

或更彻底地：把 `config` 改成显式 import / props 传入，从源头避免 `undefined`。

## DevTools 技能收获

- Console 面板看红色错误 + 堆栈
- 点错误右侧的源码链接跳到 Sources
- `%c` 样式让 `[Lab]` 提示在 Console 中视觉区分
