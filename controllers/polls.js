const pollsRouter = require('express').Router()
const Poll = require('../models/poll')
const formatPoll = require('../utils/poll-format')

pollsRouter.get('/', async (req, res) => {
    const polls = await Poll.find({})
    return res.json(polls.map(formatPoll))
})

pollsRouter.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id)
        return res.status(202).json(poll)
    } catch (err) {
        return res.status(404).send({ error: 'Unknown id' })
    }
})

pollsRouter.post('/', async (req, res) => {
    const body = req.body

    if (body.question === undefined) {
        res.status(400).json({ error: 'content missing' })
    }

    const poll = await
        new Poll({
            question: body.question,
            options: body.options,
            likes: 0,
            dateAdded: body.dateAdded
        })

    poll
        .save()
        .then(poll => {
            res.json(formatPoll(poll))
        })
})

pollsRouter.delete('/:id', async (req, res) => {

    try {
        Poll
            .findByIdAndRemove(req.params.id)
            .then(result => {
                res.status(204).end()
            })
            .catch(error => {
                res.status(404).send({ error: 'Unknown id' })
            })

    } catch (err) {
        return res.status(400).send({error: 'Failed to delete'})
    }
})

module.exports = pollsRouter