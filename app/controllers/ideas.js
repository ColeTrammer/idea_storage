"use strict";

const Idea = require("../models/ideas");
const User = require("../models/users");
const async = require("async");

module.exports = {
    all: (req, res) => {
        async.map(
            req.user.ideas,
            (id, done) => {
                Idea.findById(id, done);
            },
            (err, ideas) => {
                if (err) return res.status(503).send("Error");

                res.render("ideas", { ideas: ideas });
            }
        );
    },

    createForm: (req, res) => {
        res.render("ideas/create");
    },

    create: (req, res) => {
        if (!req.body.title || !req.body.content || !req.body.category) {
            req.flash("Invalid idea");
            res.redirect("/ideas/create");
            return;
        }

        Idea.create({ title: req.body.title, content: req.body.content, category: req.body.category }, (err, idea) => {
            if (err) return res.status(503).send("Error");

            User.updateOne({ _id: req.user._id }, { $push: { ideas: { $each: [idea._id], $position: 0 } } }, err => {
                if (err) return res.status(503).send("Error");

                res.redirect(`/ideas/${idea._id}`);
            });
        });
    },

    show: (req, res) => {
        Idea.findById(req.params.id, (err, idea) => {
            if (err) return res.status(503).send("Error");

            res.render("ideas/idea", { idea: idea });
        });
    },

    editForm: (req, res) => {
        Idea.findById(req.params.id, (err, idea) => {
            if (err) return res.status(503).send("Error");

            res.render("ideas/edit", { idea: idea });
        });
    },

    edit: (req, res) => {
        if (!req.body.title || !req.body.content || !req.body.category) {
            req.flash("Invalid edit");
            res.redirect(`/ideas/${req.params.id}/edit`);
            return;
        }

        Idea.updateOne({ _id: req.params.id }, { title: req.body.title, category: req.body.category, content: req.body.content }, err => {
            if (err) return res.status(503).send("Error");

            res.redirect(`/ideas/${req.params.id}`);
        });
    },

    delete: (req, res) => {
        Idea.deleteOne({ _id: req.params.id }, err => {
            if (err) return res.status(503).send("Error");

            User.updateOne({ _id: req.user._id }, { $pullAll: { ideas: [req.params.id] } }, err => {
                if (err) return res.status(503).send("Error");

                res.redirect("/ideas");
            });
        });
    },

    api_all: (req, res) => {
        async.map(
            req.user.ideas,
            (id, done) => {
                Idea.findById(id, done);
            },
            (err, ideas) => {
                if (err) return res.status(503).send({ error: err });

                res.send(ideas);
            }
        );
    },
};
