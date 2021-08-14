"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema({
    username: String,
    password: String,
    ideas: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Idea" }],
});

schema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", schema);
