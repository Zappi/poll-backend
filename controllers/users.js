const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')
const formatUser = require('../utils/user-format')


userRouter.get('/', async (req, res) => {
    const users = await User
        .find({})
        .populate('polls')

    res.json(users.map(formatUser))
})



userRouter.post('/', async (req, res) => {
    try {
        const body = req.body

        const existingUser = await User.find({ username: body.username })
        const existingEmail = await User.find({ email: body.email })

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username must be unique' })
        }
        if (existingEmail.length > 0) {
            return res.status(400).json({ error: 'User with this email is already created' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            password: passwordHash,
            email: body.email,
            pollsUpvoted: 0
        })

        const savedUser = await user.save()

        res.json(formatUser(savedUser))

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'something went wrong' })
    }
})


module.exports = userRouter