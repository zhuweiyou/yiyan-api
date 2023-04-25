import puppeteer, {KnownDevices} from 'puppeteer'
import {parseCookie} from "./cookie.mjs";

export class YiyanPuppeteer {
    #cookie;
    #timeout;
    #headless;

    constructor({cookie, timeout = 1000 * 30, headless = "new"}) {
        this.#cookie = parseCookie(cookie);
        this.#timeout = timeout;
        this.#headless = headless;
    }

    async prompt(input) {
        const browser = await puppeteer.launch({
            headless: this.#headless,
            ignoreDefaultArgs: ["--enable-automation"],
            args: ['--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.emulate(KnownDevices['iPhone 12 Pro Max'])
        await page.setCookie(...this.#cookie)

        await page.goto('https://yiyan.baidu.com');
        // await page.setRequestInterception(true)
        // page.on('request', event => {
        //     console.log('request', event)
        // })

        const textarea = await page.waitForSelector('#dialogue-input')
        await textarea.type(input)

        await page.evaluate(async () => {
            function get_parent_next_sibling(element) {
                const parent = element.parentNode;
                let nextSibling = parent.nextSibling;
                while (nextSibling && nextSibling.nodeType !== 1) {
                    nextSibling = nextSibling.nextSibling;
                }
                return nextSibling;
            }

            const textarea = document.querySelector('#dialogue-input')
            const send_button = get_parent_next_sibling(textarea)
            send_button.click()
        })

        const response = await page.waitForResponse(async response => {
            if (response.url().startsWith('https://yiyan.baidu.com/eb/chat/query')) {
                const json = await response.json()
                if (json.data.is_end === 1) {
                    return true
                }
            }
        }, {
            timeout: this.#timeout,
        })

        const json = await response.json()
        await browser.close();

        return json.data.text
    }
}
