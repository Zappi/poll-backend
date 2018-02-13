const mongoose = require('mongoose')

const Poll = mongoose.model('Poll', {
    question: String,
    options: [String],
    likes: Number
})

module.exports = Poll