"use strict";

const bodyParser = require("body-parser");

module.exports = {
    parseForm: bodyParser.urlencoded({ extended: false }),

    forceAuthentication: (req, res, next) => {
        if (req.isAuthenticated()) return next();

        req.flash("redirect", req.originalUrl);
        res.redirect("/login");
    },

    ownedIdea: (req, res, next) => {
        if (!req.user) {
            req.flash("errorMessages", "Must be logged in");
            return res.redirect("/login");
        }

        if (!req.params.id) {
            return res.redirect("/ideas");
        }

        for (const ideaId of req.user.ideas) {
            if (ideaId.equals(req.params.id)) return next();
        }

        req.flash("errorMessages", "Must own image");
        res.redirect("/ideas");
    },
};
