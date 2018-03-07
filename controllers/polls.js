const pollsRouter = require('express').Router()
const Poll = require('../models/poll')
const User = require('../models/user')
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

    if(body.options.length > 5) {
        return res.status(400).send({error: 'No more than 5 options is allowed'})
    }

    try {

    const user = await User.findById(body.userId);

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

pollsRouter.put('/:id', async(req, res) => {

    try {

        const newPoll = req.body
    
        const id = req.params.id
        const poll = await Poll.findById(id) 

        await Poll.findByIdAndUpdate(id, newPoll)
        const updatedPoll = await Poll.findById(id)
        res.status(201).json(updatedPoll)

    } catch (e) {
        console.log(e)
        res.status(400).send({error: 'Could not update the poll'})
    }

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