const express = require('express')
const app = express()
app.listen(7777)

const userRouter = require('./routes/user-demo')
const channelRouter = require('./routes/channel-demo')

app.use('/', userRouter)
app.use('/', channelRouter)

