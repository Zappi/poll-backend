const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')

module.exports = function(passport) {


    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.JWT_SECRET
    }, async (payload, done)=> {
        try {

            const user = await User.findById(payload._id)

            if(!user) {
                return done(null, false)
            }

            done(null, user)
        } catch (error) {
            done(error, false)
        }
    }))

}