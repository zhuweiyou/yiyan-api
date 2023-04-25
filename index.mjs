import express from 'express'
import 'express-async-errors'
import {YiyanPuppeteer} from "./yiyan-puppeteer/index.mjs";

const app = express()
app.use(express.urlencoded({extended: false}))

app.post('/yiyan-puppeteer', async (req, res) => {
    const {prompt} = req.body
    const yiyan = new YiyanPuppeteer({
        cookie: process.env.YIYAN_PUPPETEER_COOKIE,
    })
    res.json({message: await yiyan.sendMessage(prompt)})
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.json({message: err.message})
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
