var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var User = require("./models/user")

var Comment = require("./models/comment")
Campground = require("./models/campground");
// Comment = require("./models/comment")
seedDB = require("./seeds")
app.use(express.static(__dirname+"/public"))

seedDB()
mongoose.connect('mongodb://localhost/yelp_camp');

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

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.get('/', function(req, res){
    res.render("landing");
});

// Campground.create({
//     name:'Salmon Creek',
//     image:"https://upload.wikimedia.org/wikipedia/commons/0/05/Biskeri-_Camping_I_IMG_7238.jpg"
// }, function(err, camp){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(camp);
//     }
// });
// var campgrounds = [
//     {name:'Salmon Creek', image:"https://upload.wikimedia.org/wikipedia/commons/0/05/Biskeri-_Camping_I_IMG_7238.jpg"},
//     {name:'Granite Hill', image:"http://www.blog.weekendthrill.com/wp-content/uploads/2016/07/071416_1116_25AwesomeCa21.png"},
//     {name:'Mountain Rest', image:"https://www.caravancampingsites.co.uk/broomfield.jpg"}
// ];

app.get("/campgrounds", function(req, res){
    console.log(req.user);
    Campground.find({}, function(err, camp1){
        if(err){
            console.log(err);
        }else{
            // console.log(camp1)
            res.render("campgrounds/campgrounds", {places:camp1, currentUser: req.user});
        }
    })
});

app.post("/campgrounds", function(req, res){
    name=req.body.name;
    image=req.body.image;
    desc = req.body.description;
    // res.send("you hit post")
    var newCampground = {name:name, image:image, description: desc};
    Campground.create(newCampground, function(err, camp2){
        if(err){
            console.log(err);
        }else{
            // console.log(camp2);
            res.redirect("/campgrounds");
        }
    } )
    // campgrounds.push(newCampground)
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
});

app.get("/campgrounds/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp3){
        if(err){console.log(err)}else{
            // console.log(typeof camp3);
            // console.log(camp3.name);
            // console.log(camp3)
            res.render("campgrounds/show", {camp : camp3});
        }
    })
})

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){console.log(err)}else{
            // console.log(campground)
            res.render("comments/new", {campground:campground});
        }
    })

})

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

//auth routes

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
})

app.get("/login", function (req, res) {
    res.render("login");
})
app.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    // res.send("loggedin");
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect("/login")
}

app.listen(3000, "localhost", function(){
    console.log("Yelp camp has started");
});