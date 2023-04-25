import {YiyanPuppeteer} from './index.mjs'

const yiyan = new YiyanPuppeteer({
    cookie: process.env.YIYAN_PUPPETEER_COOKIE,
})

console.log(await yiyan.sendMessage('帮我画个猫'))
