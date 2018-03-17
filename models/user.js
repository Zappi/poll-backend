const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: String,
    name: String,
    password: String,
    email: String,
    userCreated: {type: Date, default: Date.now},
    polls: [{type: mongoose.Schema.Types.ObjectId, ref:'Poll'}],
    pollsUpvoted: Number
})

module.exports = User


module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}