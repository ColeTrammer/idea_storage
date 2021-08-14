"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
});

module.exports = mongoose.model("Idea", schema);
