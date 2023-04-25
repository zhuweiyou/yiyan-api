# yiyan-api

封装 **百度文心一言** 网页版 API

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

### 测试运行

```bash
npm run yiyan-puppeteer
```
