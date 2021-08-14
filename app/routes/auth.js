"use strict";

const mw = require("../middlewares");

module.exports = (app, passport) => {
    app.get("/login", (req, res) => {
        res.render("auth/login");
    });

    app.post("/login", mw.parseForm, (req, res, next) => {
        passport.authenticate("local-login", (err, user) => {
            if (err) return next(err);

            if (!user) return res.redirect("/login");

            req.logIn(user, err => {
                if (err) return next(err);

                res.redirect(req.flash("redirect")[0] || "/ideas");
            });
        })(req, res, next);
    });

    app.get("/signup", (req, res) => {
        res.render("auth/signup");
    });

    app.post(
        "/signup",
        mw.parseForm,
        passport.authenticate("local-signup", {
            successRedirect: "/ideas",
            failureRedirect: "/signup",
            failureFlash: true,
        })
    );

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};
