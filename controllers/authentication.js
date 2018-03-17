const authenticationRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const passport = require('passport')


authenticationRouter.post('/', async (req, res) => {

    const body = req.body

    const username = body.username
    const password = body.password

    const user = await User.findOne({ username: username })

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)
    console.log(passwordCorrect)
    if (!(user && passwordCorrect)) {
        return res.status(401).send({ error: 'Invalid username or password' })
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 604800
    })

    res.json({
        success: true,
        token: 'JWT ' + token,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        }
    })

})

authenticationRouter.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user })
})

module.exports = authenticationRouter