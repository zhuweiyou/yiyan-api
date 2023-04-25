import {YiyanPuppeteer} from "./index.mjs";
import {readCookie} from "./cookie.mjs";

const yiyan = new YiyanPuppeteer({
    cookie: await readCookie('./cookie.txt')
})

console.log(await yiyan.prompt("帮我画个猫"))
