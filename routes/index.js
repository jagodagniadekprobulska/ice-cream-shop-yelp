var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

//AUTH ROUTES

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        
        passport.authenticate("local")(req, res, () => {
        res.redirect("/shops");
        });
    });
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/shops",
        failureRedirect: "/login"
    }), (req, res) => {});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/shops");
});

module.exports = router;