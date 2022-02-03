const express = require('express')
const yts = require('yt-search')

const port = require('../config.json').port
const ytUrlRegex = /^(https:\/\/){0,1}(w{3}.|w{0})(music.){0,1}youtube.com\/watch\/{0,1}\?v=\w+.*$/i
const app = express()

app.use(express.json())

app.get('/', async function (req, res) {
    const track = req.query.track.substring(1, req.query.track.length - 1)
    let status = 500
    let url, title

    if (ytUrlRegex.test(track)) {
        url = track
        const params = new URLSearchParams(url.substring(url.indexOf('?') + 1))
        const v = await yts({ videoId: params.get('v') })
        title = v?.title
    } else {
        const r = await yts(track)
        const video = r?.videos[0]
        url = video?.url
        title = video?.title
    }

    status = url && title ? 200 : status

    res.status(status)
    res.send({ url, title })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
