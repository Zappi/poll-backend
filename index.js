const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const pollsRouter = require('./controllers/polls')
const userRouter = require('./controllers/users')
const authenticationRouter = require('./controllers/authentication')

const config = require('./utils/config')


mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/polls', pollsRouter)
app.use('/api/users', userRouter)
app.use('/api/authenticate', authenticationRouter)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

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