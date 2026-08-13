# 关卡 5 修复说明：Application 存储排查

## 错误现象

点"登录（记住我）"成功，但 F5 刷新后登录态丢失。

## 根因

`Scenario.tsx`：

```ts
const EXPECTED_KEY = 'app.session.token';
const WRONG_KEY = 'app.session.tokn';  // [TEACHING_BUG] 拼错

// 写入用错 key
localStorage.setItem(WRONG_KEY, fakeToken);

// 读取用对 key —— 当然读不到
const stored = localStorage.getItem(EXPECTED_KEY);
```

读写 key 不一致，所以读出来永远是 null。

## 修复

最简单：把 `WRONG_KEY` 改成和 `EXPECTED_KEY` 一致。更好的做法是用一个常量/工具函数统一管理 key 名：

```ts
// src/lib/storage.ts
export const SESSION_KEY = 'app.session.token';

export function saveSession(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}
```

然后所有调用点都用 `saveSession / loadSession`，杜绝拼写错误。

## DevTools 技能收获

- Application 面板是"前端本地数据"的全景视图
- Local Storage / Session Storage / IndexedDB / Cookies 都在这里
- 双击 key 或 value 可直接编辑（适合调试时改值验证假设）
- 顶部的"清除站点数据"按钮可一键重置

## 常见踩坑

- localStorage 只能存字符串——对象要 `JSON.stringify` / `JSON.parse`
- key 区分大小写
- 在隐私模式下 localStorage 可能不可用（容量限制 / 直接禁用）
- Cookie 设置 `Secure` 标志后，http://localhost 不会写入（要在 https 环境测）
