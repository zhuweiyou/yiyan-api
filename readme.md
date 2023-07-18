# yiyan-api

封装 **百度文心一言** 网页版 API

## 使用方法

### 安装依赖并运行

安装 Node.js v18 环境

```bash
npm install
npm start
```

> 如果 install 失败请参考这里解决 <https://pptr.dev/troubleshooting>

### Docker 运行

> 已提供 dockerfile, 可自行 docker build

### 登录获取 Cookie

登录文心一言主页, F12 在 network 随便找一个请求, 在 Cookie 处右键 Copy value

![copyvalue截图](https://user-images.githubusercontent.com/8413791/234236373-ed430dd0-087a-4df9-b916-65aac073f4fa.png)

### 调用 API 提问

BASE_URL `http://localhost:3000`

POST `/headless`

-   `cookie` 前面步骤获取到的 Cookie
-   `prompt` 提问内容

成功响应

```json5
{
    "text": "文本内容",
    "image": "https://图片地址" // 作图时会返回, 没有图返回 null
}
```

失败响应

```json
{
    "message": "错误消息"
}
```

![文本](https://user-images.githubusercontent.com/8413791/234453028-eb95e54a-e0b0-4ccd-ac8f-645797d97672.png)

![图片](https://user-images.githubusercontent.com/8413791/234453032-d5d33917-a72c-4412-b3f8-0d4c90540a1c.png)
