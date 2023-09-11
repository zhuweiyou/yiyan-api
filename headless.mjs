import puppeteer, {KnownDevices} from 'puppeteer'
import sleep from 'then-sleep'

export async function headless({cookie, timeout = 1000 * 60, headless = 'new', prompt}) {
    let browser
    try {
        browser = await puppeteer.launch({
            headless,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage()
        await page.emulate(KnownDevices['iPhone SE'])
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
            if (body_text.includes('接受协议') && body_text.includes('暂时退出')) {
                for (const div of document.querySelectorAll('div')) {
                    if (div.textContent.includes('接受协议')) {
                        div?.click()
                    }
                }
            }

            return body_text.includes('登录') && (body_text.includes('加入体验') || body_text.includes('开始体验'))
        })
        if (need_login) {
            throw new Error('cookie失效, 请重新登录')
        }

        const message_input = await page.waitForSelector('#dialogue-input', {
            timeout,
        })
        await message_input.type(prompt)
        await sleep(1000)

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

        let text = null
        await page.waitForResponse(
            async response => {
                try {
                    const response_url = response.url()
                    console.log(response_url)
                    if (response_url.startsWith('https://yiyan.baidu.com/eb/chat/conversation/v2')) {
                        // event-stream
                        // 参考 chat_conversation.txt
                        const response_text = await response.text()
                        const last_line = response_text.trim().split('\n').pop()
                        const json_string = last_line.replace('data:', '')
                        const json_object = JSON.parse(json_string)
                        if (json_object?.data?.is_end === 1) {
                            text = json_object.data.tokens_all
                            return true
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            {
                timeout,
            }
        )

        const image = text.match(/<img src="(.*?)"/)
        return {text, image: image ? image[1].replace('=style/wm_ai', '').replace('http://', 'https://') : null}
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
                name: name?.trim(),
                value: value.join('='),
                domain: 'yiyan.baidu.com',
            }
        })
        .filter(item => item.name)
}
