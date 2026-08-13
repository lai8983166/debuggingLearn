# 关卡 8 修复说明：综合多面板排查（结业）

## 错误现象

填表单点"提交"，弹出"提交失败：Bad Request: unknown field..."。

## 排查路径（结业示范）

1. **Console** —— 看到 `[App] 正在发送 payload: { ..., contactMail: "..." }`
2. **Network** —— 看 `/api/feedback` 的 Response：`unknown field "contactMail". Did you mean "contactEmail"?`
3. **Sources** —— 在 `buildPayload` 设断点，单步执行，确认返回的对象字段名

## 根因

```ts
interface FeedbackPayload {
  message: string;
  rating: number;
  contactMail?: string;  // [TEACHING_BUG] 应该是 contactEmail
}

function buildPayload(message, rating, email): FeedbackPayload {
  return { message, rating, contactMail: email };  // 拼错
}
```

## 修复

```ts
interface FeedbackPayload {
  message: string;
  rating: number;
  contactEmail?: string;
}

function buildPayload(message, rating, email): FeedbackPayload {
  return { message, rating, contactEmail: email };
}
```

更好的工程实践：用 TypeScript + zod 在编译时和运行时双重校验 payload schema，让字段名拼写错误在编译期就暴露。

## 7 关技能回顾

| 关卡 | 面板 | 你学会了 |
| --- | --- | --- |
| 1 | Console | 看红色错误、跳源码 |
| 2 | Elements | 检查 DOM、实时改样式 |
| 3 | Sources | 断点、Scope、单步 |
| 4 | Network | 看请求状态码、Response |
| 5 | Application | 检查 localStorage/Cookies |
| 6 | Performance | 录制、火焰图 |
| 7 | Memory | 快照对比、Retainers |
| 8 | 综合 | 多面板协作 |

## 推荐进阶

- **Lighthouse**：综合性能/可访问性/SEO 评分
- **Coverage**：找出未使用的 JS/CSS（Coverage 面板）
- **Recorder**：录制操作做端到端回归
- **Chrome DevTools Protocol**：自动化控制（Puppeteer / Playwright 底层用的就是这个）

恭喜结业 🎓
