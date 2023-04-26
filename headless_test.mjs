import { headless } from './headless.mjs'

console.log(
    await headless({
        cookie: process.env.YIYAN_COOKIE,
        prompt: '画只猫',
        headless: false,
    })
)
