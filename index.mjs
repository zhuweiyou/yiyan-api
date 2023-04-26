import express from 'express'
import 'express-async-errors'
import {headless} from "./headless.mjs";

const app = express()
app.use(express.urlencoded({extended: false}))

app.post('/headless', async (req, res) => {
    const {prompt, cookie} = req.body
    const text = await headless({
        cookie,
        prompt,
    })
    res.json({text})
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.json({message: err.message})
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
