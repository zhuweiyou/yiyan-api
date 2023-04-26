import puppeteer, {KnownDevices} from 'puppeteer'

export async function headless({cookie, timeout = 1000 * 30, headless = 'new', prompt}) {
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
        await page.goto('https://yiyan.baidu.com')

        const need_login = await page.evaluate(() => {
            const body_text = document.body.innerText
            return body_text.includes('登录') && body_text.includes('加入体验')
        })
        if (need_login) {
            throw new Error('未登录')
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
                    if (json.data.is_end === 1) {
                        return true
                    }
                }
            },
            {
                timeout,
            }
        )
        const json = await response.json()

        // 不知道应该取 text 还是 content, 看起来是一样的?
        return String(json.data.text || json.data.content || '').trim()
    } finally {
        browser?.close()
    }
}

function parse_cookie(cookie) {
    return cookie.trim().split('; ').map(item => {
        const [name, ...value] = item.split('=')
        return {
            name,
            value: value.join('='),
            domain: 'yiyan.baidu.com',
        }
    })
}
