"use strict";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sass = require("express-compile-sass");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
require("./app/config/passport")(passport);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "app/views"));

app.use(
    sass({
        root: __dirname,
        sourceMap: true,
        sourceComments: true,
        watchFiles: true,
        logToConsole: false,
    })
);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessages = req.flash("successMessages");
    res.locals.errorMessages = req.flash("errorMessages");
    res.locals.user = req.user;
    next();
});

require("./app/routes")(app, passport);

app.listen(process.env.PORT);
