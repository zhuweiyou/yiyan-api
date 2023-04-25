# yiyan-api

封装 **百度文心一言** 网页版 API

> 目前处于开发阶段, 有空再慢慢完善

## 使用方法

### 安装依赖

```bash
npm install
```

### 填写 COOKIE

登录文心一言主页, F12 在 network 随便找一个请求, 在 Cookie 处右键 Copy value, 粘贴到这个 txt 中

```
./yiyan-puppeteer/cookie.txt
```

![copyvalue截图](https://user-images.githubusercontent.com/8413791/234236373-ed430dd0-087a-4df9-b916-65aac073f4fa.png)


### 测试运行

```bash
npm run yiyan-puppeteer
```

![yiyan-puppeteer运行截图](https://user-images.githubusercontent.com/8413791/234236909-ad14432b-29b8-4276-bb72-05c003be4b20.png)
