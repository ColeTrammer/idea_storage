"use strict"

const Idea = require("../models/ideas")
const User = require("../models/users")
const async = require("async")

module.exports = {

    all: (req, res) => {
        async.map(req.user.ideas, (id, done) => {
            Idea.findById(id, done)
        }, (err, ideas) => {
            if (err)
                return res.status(503).send("Error")
            
            res.render("ideas", { ideas: ideas })
        })
    },

    createForm: (req, res) => {
        res.render("ideas/create")
    },

    create: (req, res) => {
        if (!req.body.title || !req.body.content || !req.body.category) {
            req.flash("Invalid idea")
            res.redirect("/ideas/create")
        }

        Idea.create({ title: req.body.title, content: req.body.content, category: req.body.category }, (err, idea) => {
            if (err)
                return res.status(503).send("Error")
            
            User.updateOne({ _id: req.user._id }, { $push: { ideas: { $each: [ idea._id ], $position: 0 } } }, (err) => {
                if (err)
                    return res.status(503).send("Error")
                
                res.redirect(`/ideas/${idea._id}`)
            })
        })
    },

    show: (req, res) => {
        Idea.findById(req.params.id, (err, idea) => {
            if (err)
                return res.status(503).send("Error")

            res.render("ideas/idea", { idea: idea })
        })
    }

}