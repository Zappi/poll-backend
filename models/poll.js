const mongoose = require('mongoose')

const Poll = mongoose.model('Poll', {
    question: String,
    options: [{option: String, upvotes: Number}],
    likes: Number,
    dateAdded: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, red: 'User '}
})

module.exports = Poll