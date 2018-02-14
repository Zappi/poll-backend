const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: String,
    password: String,
    email: String,
    userCreated: {type: Date, default: Date.now},
    pollsCreated: Number,
    pollsAnswered: Number,
    pollsUpvoted: Number
})

module.exports = User