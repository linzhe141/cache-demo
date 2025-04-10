# 协商缓存和强缓存

> `nodejs http 服务器代码`https://github.com/linzhe141/cache-demo/blob/main/index.js

## 强缓存

当浏览器第一次请求一个资源时，服务器在响应头加上`"Cache-Control": "max-age=3600"`，并且`HTTP的状态码为200`，然后浏览器接收到响应后，就把这个资源加入到浏览器缓存中，那么下次在没有过期前访问这个资源时，就会直接命中浏览器缓存了，并且不会在向服务器发送请求了。

从这张图片的`强缓存~`日志我们知道，只有在第一次访问时，是发送到服务器的，后面都没有在向服务器发送请求了。

![Image](https://github.com/user-attachments/assets/761576d8-5e55-408c-90b5-242ea5e6ad54)

但强缓存也存在一个问题，就是如果这个资源真的被修改了，但是文件名又没有改变，这样还是会命中强缓存。导致浏览器无法获取最新的资源。

## 协商缓存

当浏览器第一次请求一个资源时，服务器在响应头加上`"Last-Modified": lastModified,"Cache-Control": "no-cache", `，并且`HTTP的状态码为200`，其中 lastModified 表示当前这个资源的最后一次的修改时间，当浏览器接收到响应后就会标记这个资源是一个`协商缓存`。然后浏览器下次在访问这个资源时，就会自动在请求头加上`if-modified-since: lastModified`这个字段，`注意这个每次都向服务器发送了请求了的，无论是否命中缓存`，因为这个是否命中缓存要通过服务器来判断，当服务器对比了`if-modified-since和该文件的lastModified`后。如果是相等的，这就表示命中了协商缓存，并且`HTTP状态码是304`，然后不会响应任何东西了，浏览器就会直接使用`协商缓存`。

从这张图片的`协商缓存~`日志我们知道，每次访问都是发送到服务器的。

![Image](https://github.com/user-attachments/assets/727a8cd6-c3ea-46ef-bbb4-6d34f208bb1a)
