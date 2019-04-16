"use strict"

const mw = require("../middlewares")
const idea = require("../controllers/ideas")

module.exports = (app, passport) => {

    app.get("/", (req, res) => {
        res.redirect("/login")
    })

    app.get("/ideas", mw.forceAuthentication, idea.all)

    app.get("/ideas/create", mw.forceAuthentication, idea.createForm)
    app.post("/ideas/create", mw.forceAuthentication, mw.parseForm, idea.create)

    app.get("/ideas/:id", mw.forceAuthentication, idea.show)

    require("./auth")(app, passport)

}