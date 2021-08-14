"use strict";

const mw = require("../middlewares");
const idea = require("../controllers/ideas");

module.exports = (app, passport) => {
    app.get("/", (req, res) => {
        res.redirect("/ideas");
    });

    app.get("/ideas", mw.forceAuthentication, idea.all);

    app.get("/ideas/create", mw.forceAuthentication, idea.createForm);
    app.post("/ideas/create", mw.forceAuthentication, mw.parseForm, idea.create);

    app.get("/ideas/:id", mw.forceAuthentication, mw.ownedIdea, idea.show);

    app.get("/ideas/:id/edit", mw.forceAuthentication, mw.ownedIdea, idea.editForm);
    app.post("/ideas/:id/edit", mw.forceAuthentication, mw.ownedIdea, mw.parseForm, idea.edit);

    app.get("/ideas/:id/delete", mw.forceAuthentication, mw.ownedIdea, idea.delete);

    app.get("/api/ideas", mw.forceAuthentication, idea.api_all);

    require("./auth")(app, passport);
};
