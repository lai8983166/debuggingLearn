# 关卡 19 修复说明：CORS 错误

## 错误现象

跨域 fetch 失败。错误信息只有 `"Failed to fetch"`，但 Console 有详细 CORS 报错。

## CORS 是什么

**CORS（Cross-Origin Resource Sharing）** 是浏览器的安全机制：

- **同源** = 协议 + 域名 + 端口都相同
- **跨域请求** 默认被浏览器**阻止**，除非服务器**明确允许**

注意：CORS 是浏览器行为，**不是服务器的限制**。服务器实际上收到了请求、处理了、返回了响应——只是浏览器不把响应交给 JS。

## 服务器如何允许跨域

在响应头加：

```
Access-Control-Allow-Origin: https://your-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

或简单粗暴（不推荐生产）：

```
Access-Control-Allow-Origin: *
```

## 服务器配置示例

### Express (Node.js)

```js
import cors from 'cors';
app.use(cors({
  origin: 'https://your-frontend.com',
  credentials: true,
}));
```

### Nginx

```nginx
location /api {
  add_header Access-Control-Allow-Origin "https://your-frontend.com";
  add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE";
  if ($request_method = OPTIONS) {
    return 204;
  }
}
```

### Spring Boot

```java
@CrossOrigin(origins = "https://your-frontend.com")
@RestController
public class ApiController { ... }
```

## Preflight（预检）请求

非"简单请求"会先发一个 **OPTIONS** 请求做 preflight：

- 自定义 header（如 `Authorization`、`X-Api-Key`）
- `Content-Type: application/json`
- 非 GET/POST/HEAD 方法

Preflight 的响应必须带：

```
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400   // 24 小时内不重发 preflight
```

## 开发期的快速绕过

**绝对不要在生产用**，但开发期方便：

1. **代理**：用 Vite/Webpack dev server 的 proxy 转发，绕过浏览器同源限制
   ```js
   // vite.config.ts
   server: { proxy: { '/api': 'https://api.example.com' } }
   ```
2. **浏览器禁用 CORS**：启动 Chrome 时加 `--disable-web-security --user-data-dir=...`（仅本地调试）

## 常见误区

- ❌ "前端 fetch 加 mode: 'no-cors' 就行了" → 错。no-cors 让响应变成 opaque，JS 读不到
- ❌ "Postman 能跑浏览器不能跑，肯定是前端 bug" → 错。Postman 不实现 CORS。问题在服务器
- ❌ "加个 header 就能绕过" → 错。CORS 只能服务端配置

## DevTools 技能收获

- Console 的 CORS 错误模式识别
- Network 面板的 Preflight（OPTIONS）请求
- 看响应头里的 Access-Control-Allow-* 系列字段
- Status 列的 (failed) vs (blocked) 含义
