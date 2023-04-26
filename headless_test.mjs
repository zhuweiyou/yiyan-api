import {headless} from "./headless.mjs";

try {
    const text = await headless({
        cookie: process.env.YIYAN_COOKIE,
        prompt: '画只猫',
        headless: false,
    })
    console.log(text)
} catch (e) {
    console.error(e)
}
