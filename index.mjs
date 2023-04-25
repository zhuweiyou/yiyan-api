import {YiyanPuppeteer} from "./yiyan-puppeteer/index.mjs";
import {readCookie} from "./yiyan-puppeteer/cookie.mjs";
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function yiyan(req, res) {
    const {prompt} = req.body
    const yiyan = new YiyanPuppeteer({
        cookie: await readCookie(resolve(__dirname, 'yiyan-puppeteer/cookie.txt')),
    })
    res.json({message: await yiyan.prompt(prompt)})
}
