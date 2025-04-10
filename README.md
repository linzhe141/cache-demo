# 浏览器缓存机制：强缓存 vs 协商缓存

📁 示例代码：[Node.js HTTP 服务器示例](https://github.com/linzhe141/cache-demo/blob/main/index.js)

---

## 🚀 强缓存（**不会发起请求**）

- **首次请求资源**时，服务器返回状态码 `200`，并在响应头中添加：

  ```http
  Cache-Control: max-age=3600
  ```

- 浏览器接收到后，会将资源缓存并在 **未过期前** 直接从缓存中读取，**不会再请求服务器**。

📌 **图示说明**  
从下图可以看到，只有第一次访问命中服务器，之后的请求都直接命中缓存，不发送请求：

![强缓存日志图示](https://github.com/user-attachments/assets/761576d8-5e55-408c-90b5-242ea5e6ad54)

### ⚠️ 强缓存的问题

若资源已经修改，但文件名未变，强缓存仍会命中缓存，导致无法获取最新内容。

---

## 🔄 协商缓存（**每次都请求，但可能不返回内容**）

- 第一次请求，服务器响应如下头部，状态码为 `200`：

  ```http
  Last-Modified: [时间戳]
  Cache-Control: no-cache
  ```

- 浏览器收到响应后，将资源标记为协商缓存。

- **下次请求**时，浏览器会带上：

  ```http
  If-Modified-Since: [上次的Last-Modified]
  ```

- 服务器比较这个值与资源实际修改时间，如果一致，返回：

  ```http
  HTTP/1.1 304 Not Modified
  ```

  并不返回实际内容，浏览器继续使用缓存。

📌 **图示说明**  
从下图可以看到，每次都发送请求，但如果命中缓存，返回的是 `304`：

![协商缓存日志图示](https://github.com/user-attachments/assets/727a8cd6-c3ea-46ef-bbb4-6d34f208bb1a)

---

## ✅ 更进一步：使用 `ETag`

- `ETag` 是服务器为资源生成的唯一标识（通常是哈希值），相比修改时间更精准。
- 浏览器请求时带上：

  ```http
  If-None-Match: "ETag值"
  ```

- 服务器比较后，如果资源未变，返回 `304`，否则返回新的资源和新的 `ETag`。

---

## 🧠 总结对比

| 缓存类型     | 没过期之前是否发请求 | 状态码             | 是否使用缓存              | 请求头字段                            | 响应头字段                 |
| ------------ | ------------------ | ------------------ | ----------------------- | ------------------------------------ | -------------------------- |
| **强缓存**   | ❌ 否              | `200 from cache`   | ✅ 是（直接使用）         | _无_                                 | `Cache-Control`, `Expires` |
| **协商缓存** | ✅ 是              | `304 Not Modified` | ✅ 是（服务器确认后使用） | `If-Modified-Since` / `If-None-Match` | `Last-Modified` / `ETag`   |
