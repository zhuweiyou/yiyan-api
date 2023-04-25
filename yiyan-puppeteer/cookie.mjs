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
