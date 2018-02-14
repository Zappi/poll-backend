const formatPoll = (poll) => {
    return {
        id: poll._id,
        question: poll.question,
        options: poll.options,
        likes: poll.likes,
        dateAdded: poll.dateAdded
    }
}

module.exports = formatPoll;