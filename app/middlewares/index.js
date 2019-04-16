"use strict"

const bodyParser = require("body-parser")

module.exports = {
    parseForm: bodyParser.urlencoded({ extended: false }),
    forceAuthentication: (req, res, next) => {
        if (req.isAuthenticated())
            return next()

        req.flash("redirect", req.originalUrl);
        res.redirect("/login")
    }
}