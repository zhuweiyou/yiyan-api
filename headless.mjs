import puppeteer, { KnownDevices } from 'puppeteer'

export async function headless({ cookie, timeout = 1000 * 30, headless = 'new', prompt }) {
    let browser
    try {
        browser = await puppeteer.launch({
            headless,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage()
        await page.emulate(KnownDevices['iPhone 12 Pro Max'])
        await page.setCookie(...parse_cookie(cookie))

        if (headless) {
            await page.setRequestInterception(true)
            page.on('request', request => {
                if (['stylesheet', 'font', 'image'].includes(request.resourceType())) {
                    request.abort()
                } else {
                    request.continue()
                }
            })
        }

        await page.goto('https://yiyan.baidu.com')

        const need_login = await page.evaluate(() => {
            const body_text = document.body.innerText
            return body_text.includes('登录') && body_text.includes('加入体验')
        })
        if (need_login) {
            throw new Error('cookie失效, 请重新登录')
        }

        const message_input = await page.waitForSelector('#dialogue-input', {
            timeout,
        })
        await message_input.type(prompt)
        await page.evaluate(async () => {
            function get_parent_next_sibling(element) {
                const parent = element.parentNode
                let next_sibling = parent.nextSibling
                while (next_sibling && next_sibling.nodeType !== 1) {
                    next_sibling = next_sibling.nextSibling
                }
                return next_sibling
            }

            const message_input = document.querySelector('#dialogue-input')
            const send_button = get_parent_next_sibling(message_input)
            send_button.click()
        })

        const response = await page.waitForResponse(
            async response => {
                if (response.url().startsWith('https://yiyan.baidu.com/eb/chat/query')) {
                    const json = await response.json()
                    return json.data.is_end === 1
                }
            },
            {
                timeout,
            }
        )
        const json = await response.json()

        // 不知道应该取 text 还是 content, 看起来是一样的?
        let text = String(json.data.text || json.data.content || '').trim()
        const is_image = `?x-bce-process=style/wm_ai`
        if (text.includes(is_image)) {
            text = text.replace(is_image, `?x-bce-process=`)
        }

        return text
    } finally {
        browser?.close()
    }
}

function parse_cookie(cookie) {
    return cookie
        .trim()
        .split('; ')
        .map(item => {
            const [name, ...value] = item.split('=')
            return {
                name,
                value: value.join('='),
                domain: 'yiyan.baidu.com',
            }
        })
}
