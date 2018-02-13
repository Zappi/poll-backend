const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const pollsRouter = require('./controllers/polls')

const config = require('./utils/config')


mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(cors())

app.use('/api/polls', pollsRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}