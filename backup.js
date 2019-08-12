"use strict"

if (process.env.NODE_ENV !== "production")
    require("dotenv").config()

const mongoose = require("mongoose")
const fs = require("fs")
const async = require("async")

const Idea = require("./app/models/ideas")
const User = require("./app/models/users")

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

fs.mkdirSync(".backup-temp")
fs.mkdirSync(".backup-temp/users")
fs.mkdirSync(".backup-temp/ideas")

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const handleError = (err) => {
    console.log(err)

    deleteFolderRecursive(".backup-temp")

    process.exit()
}

User.find({}, (err, users) => {
    if (err) return handleError(err)

    async.forEach(users, (user, done) => {
        fs.writeFileSync(`.backup-temp/users/${user._id}.json`, JSON.stringify(user))

        async.map(user.ideas, (id, done) => {
            Idea.findById(id, done)
        }, (err, ideas) => {
            if (err) return handleError(err)
            
            async.forEach(ideas, (idea, done) => {
                fs.writeFile(`.backup-temp/ideas/${idea._id}.json`, JSON.stringify(idea), done)
            }, done)
        }, done)
    }, (err) => {
        if (err) return handleError(err)

        deleteFolderRecursive(".backup")
        fs.renameSync(".backup-temp", ".backup")
        process.exit()
    })
})