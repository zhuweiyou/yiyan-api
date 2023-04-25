import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { YiyanPuppeteer } from './index.mjs'
import { readCookie } from './cookie.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const yiyan = new YiyanPuppeteer({
    cookie: await readCookie(resolve(__dirname, 'cookie.txt')),
})

console.log(await yiyan.prompt('帮我画个猫'))
