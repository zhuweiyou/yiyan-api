# yiyan-api

封装 **百度文心一言** 网页版 API

> 目前处于开发阶段, 持续完善中

## 使用方法

### 安装依赖并运行

安装 Node.js v18 环境

```bash
npm install
npm start
```

> 如果 install 失败请参考这里解决 <https://pptr.dev/troubleshooting>

### Docker 运行

> 目前暂未发布到 Docker Hub, 已提供 dockerfile, 你可以自行 docker build

### 登录获取 Cookie

登录文心一言主页, F12 在 network 随便找一个请求, 在 Cookie 处右键 Copy value

![copyvalue截图](https://user-images.githubusercontent.com/8413791/234236373-ed430dd0-087a-4df9-b916-65aac073f4fa.png)

### 调用 API 提问

BASE_URL `http://localhost:3000`

POST `/headless`

- `cookie` 前面步骤获取到的 cookie 字符串
- `prompt` 提问内容

成功响应

```json
{
    "text": "文心一言的回答"
}
```

失败响应

```json
{
    "message": "错误消息"
}
```

![文字提问](https://user-images.githubusercontent.com/8413791/234451345-fa600f84-8c1c-4f04-be04-834a7f12fc26.png)

![画图提问](https://user-images.githubusercontent.com/8413791/234451353-f2a7459e-5e72-45cb-bf9f-3145c9551348.png)
