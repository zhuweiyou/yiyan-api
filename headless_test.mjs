import { headless } from './headless.mjs'

async function headless_test() {
    const cookie = process.env.YIYAN_COOKIE
    if (!cookie) {
        console.log('设置环境变量 export YIYAN_COOKIE=xxxx 之后, 运行 npm test 测试')
        return
    }

    console.log(
        await headless({
            cookie,
            prompt: '画个牛',
            headless: false,
        })
    )
}

headless_test()
