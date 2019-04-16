"use strict"

const mw = require("../middlewares")

module.exports = (app, passport) => {

    app.get("/", (req, res) => {
        res.redirect("/login")
    })

    app.get("/ideas", mw.forceAuthentication, (req, res) => {
        res.render("ideas")
    })

    require("./auth")(app, passport)

}