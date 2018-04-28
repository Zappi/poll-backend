const pollsRouter = require('express').Router()
const Poll = require('../models/poll')
const User = require('../models/user')
const formatPoll = require('../utils/poll-format')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getTokenFromRequest = (req) => {
    const token = req.headers['authorization'].replace(/^JWT\s/, '');
    return token
}

const getUserIdFromHeader = (req) => {
    return req.headers['userid']
}

pollsRouter.get('/', async (req, res) => {
    const polls = await Poll
        .find({})
        .populate('user', { username: 1, name: 1 })
        .sort({ dateAdded: -1 })
    return res.json(polls.map(formatPoll))
})

pollsRouter.get('/newpoll', passport.authenticate('jwt', { session: false }), async (req, res, err) => {

    try {

        const token = getTokenFromRequest(req)

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        re

    } catch (e) {
        console.log(e)

    }
})

pollsRouter.get('/poll/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id)
        return res.status(202).json(poll)
    } catch (err) {
        return res.status(404).send({ error: 'Unknown id' })
    }
})

pollsRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const body = req.body

    if (body.question === undefined) {
        res.status(400).json({ error: 'content missing' })
    }

    if (body.options.length > 5) {
        return res.status(400).send({ error: 'No more than 5 options is allowed' })
    }

    try {

        const token = getTokenFromRequest(req)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const userId = Object.values(decodedToken)[2]

        const user = await User.findById(userId);


        const poll = await
            new Poll({
                question: body.question,
                options: body.options,
                likes: 0,
                user: user._id
            })

        const savedPoll = await poll.save()
        user.polls = user.polls.concat(savedPoll._id)
        await user.save()

        res.json(formatPoll(savedPoll))

    } catch (e) {
        console.log(e)
    }
})


//Voting route
pollsRouter.put('/poll/:id', async (req, res) => {

    try {

        const newPoll = req.body

        const id = req.params.id
        const poll = await Poll.findById(id)

        await Poll.findByIdAndUpdate(id, newPoll)
        const updatedPoll = await Poll.findById(id)
        res.status(201).json(updatedPoll)

    } catch (e) {
        console.log(e)
        res.status(400).send({ error: 'Could not update the poll' })
    }

})

pollsRouter.delete('/poll/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {

    try {

        const poll = await Poll.findById(req.params.id)

        const token = getTokenFromRequest(req)
        const userId = getUserIdFromHeader(req)

        const user = await User.findById(userId)

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!token || !decodedToken) {
            return status(401).json({ error: 'Token missing or invalid' })
        }

        if (poll.user.toString() === decodedToken._id.toString()) {
            await poll.remove()
            
            const filteredPolls = user.polls.filter(removedPoll => removedPoll.toString() !== poll._id.toString())

            await User.findByIdAndUpdate(userId, {
                polls: filteredPolls
            })

            return res.status(204).send("Poll removed").end()
        }

        return res.status(403).send('Not authorized')

    } catch (err) {
        return res.status(400).send({ error: 'Failed to delete' })
    }

})

module.exports = pollsRouter