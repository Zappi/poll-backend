const formatUser = (user) => {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        userCreated: user.userCreated,
        password: user.password,
        polls: user.polls,
        pollsUpvoted: user.pollsUpvoted
    }
}

module.exports = formatUser