"use strict"

const LocalStrategy = require("passport-local").Strategy
const User = require("../models/users")

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, done)
    })

    passport.use("local-signup", new LocalStrategy({
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            User.findOne({ "username": username }, (err, user) => {
                if (err)
                    return done(err)

                if (user) {
                    req.flash("errorMessages", "User already exists.")
                    return done(null, false)
                }

                const newUser = new User()

                newUser.username = username
                newUser.password = newUser.generateHash(password)

                return newUser.save(done)
            })
        })
    }))

    passport.use("local-login", new LocalStrategy({
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            User.findOne({ username: username }, (err, user) => {
                if (err)
                    return done(err)

                if (!user) {
                    req.flash("errorMessages", "User does not exist. Please sign up.")
                    return done(null, false)
                }

                if (!user.validPassword(password)) {
                    req.flash("errorMessages", "Incorrect password. Please try again.")
                    return done(null, false)
                }

                return done(null, user)
            })
        })
    }))
}