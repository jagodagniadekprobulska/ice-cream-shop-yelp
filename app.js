var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var User = require("./models/user");
var seedDB = require("./seeds");
var methodOverride = require("method-override");
var indexRoutes = require("./routes/index");
var shopsRoutes = require("./routes/shops");
var commentRoutes = require("./routes/comments");

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/ice_yelp', { useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Phrase to secret setup...",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/shops", shopsRoutes);
app.use("/shops/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is listening!");
});