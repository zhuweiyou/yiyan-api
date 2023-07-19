// 设置环境变量 export YIYAN_COOKIE=xxxx 之后运行 npm test 测试
import { headless } from './headless.mjs'

console.log(
    await headless({
        cookie: process.env.YIYAN_COOKIE,
        prompt: '画只猫',
        headless: false,
    })
)
