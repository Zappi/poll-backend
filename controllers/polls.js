const pollsRouter = require('express').Router()
const Poll = require('../models/poll')

pollsRouter.get('/', async (req, res) => {
    const polls = await Poll.find({})
    res.json(polls)
})

pollsRouter.post('/', (req,res) => {
    const body = req.body
    
    if(body.question === undefined) {
        res.status(400).json({error: 'content missing'})
    }
    
    const poll = new Poll({
        question: body.question,
        options: body.options,
        likes: 0
    })

    poll
        .save()
        .then(poll => {
            res.json(poll)
        })

})

module.exports = pollsRouter