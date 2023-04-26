import express from 'express'
import 'express-async-errors'
import { headless } from './headless.mjs'

const app = express()
app.use(express.urlencoded({ extended: false }))

app.post('/headless', async (req, res) => {
    const { prompt, cookie } = req.body
    if (!prompt) {
        throw new Error('prompt 必填')
    }
    if (!cookie) {
        throw new Error('cookie 必填')
    }

    const text = await headless({
        cookie,
        prompt,
    })
    if (!text) {
        throw new Error('响应为空')
    }

    res.json({ text })
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.json({ message: err.message })
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
