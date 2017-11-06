var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport")
var LocalStrategy = require("passport-local")
var seedDB = require("./seeds")
// var passportLocalMongoose = require("passport-local-mongoose")

//requiring models
var User = require("./models/user");
var Comment = require("./models/comment");
var Campground = require("./models/campground");

// requiring routes
var campgroundRoutes = require("./routes/campgrounds")
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"))

// seedDB()


//passport config
app.use(require("express-session")({
    secret: " a key to decrypt sessions",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, "localhost", function(){
    console.log("Yelp camp has started");
});