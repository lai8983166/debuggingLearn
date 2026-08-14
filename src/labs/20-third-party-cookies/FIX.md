# 关卡 20 修复说明：第三方 Cookie / SameSite

## 错误现象

用户从邮件链接直接点进来，登录态丢失。但同站内跳转没事。

## SameSite 三档

| 值 | 行为 | 适用 |
| --- | --- | --- |
| **Strict** | 只在同站请求中发送 | 安全但用户体验差（链接进来都要重登） |
| **Lax**（默认） | 同站 + 顶层 GET 导航发送 | 平衡，**POST 跨站不带** |
| **None** | 跨站都带，但**必须配 Secure** | 第三方追踪 / 嵌入式应用 |

## Chrome 时间表

- **Chrome 80（2020）**：默认 SameSite=Lax
- **Chrome 51+**：`SameSite=None; Secure` 必须搭配 HTTPS
- **2022-2024**：逐步禁用第三方 cookie（即便 `SameSite=None`）
- **替代方案**：CHIPS（Partitioned cookies）、Storage Access API、First-Party Sets

## 修复策略

### 1. 如果 cookie 应该跨站携带（如 SSO）

```http
Set-Cookie: session=xxx; SameSite=None; Secure; HttpOnly; Path=/; Max-Age=3600
```

注意 `Secure` 必须，否则被拒。

### 2. 如果只是顶层导航需要

`SameSite=Lax` 已经够用（同站 + 顶层 GET）。但 POST 跨站不带。

### 3. iframe 嵌入的第三方应用

iframe 是"第三方上下文"。Chrome 在禁用第三方 cookie 后，即便 `SameSite=None` 也不带。替代：

- **CHIPS（Partitioned cookies）**：`SameSite=None; Secure; Partitioned`
- **postMessage**：父页面向 iframe 发 token，iframe 自己存 localStorage

## 设置 Cookie 的代码

### 服务端（推荐）

```http
Set-Cookie: app_session=xxx; SameSite=Lax; Secure; HttpOnly; Path=/; Max-Age=3600
```

### 前端 JS（限制多，不推荐）

```js
document.cookie = 'app_session=xxx; SameSite=Lax; Secure; Path=/; Max-Age=3600';
// JS 无法设置 HttpOnly
```

## 常见误区

- ❌ "本地 localhost 测试能用，部署到 HTTPS 就坏了" → SameSite=None 需要 Secure，本地 http 没法测
- ❌ "加了 SameSite=None 还是不行" → 没 Secure
- ❌ "iframe 里登录总是失败" → 第三方 cookie 限制，考虑 partitioned cookies

## DevTools 技能收获

- Application → Cookies 看每个 cookie 的所有字段（Name/Value/Domain/Path/Expires/Size/HttpOnly/Secure/SameSite）
- 双击单元格直接编辑 cookie（开发期实验）
- Console 的 "Cookie rejected" 警告含义
- 区分第一方（同站）vs 第三方（跨站）cookie
