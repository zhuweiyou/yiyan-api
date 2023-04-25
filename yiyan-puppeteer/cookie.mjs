import { readFile } from 'fs/promises'

export function parseCookie(cookie) {
    return cookie.split('; ').map(item => {
        const [name, ...value] = item.split('=')
        return {
            name,
            value: value.join('='),
            domain: 'yiyan.baidu.com',
        }
    })
}

export async function readCookie(file) {
    return (await readFile(file)).toString().trim()
}
