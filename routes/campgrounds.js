var express = require("express");
var router = express.Router();
var Campground =require("../models/campground")

//Show all campgrounds
router.get("/", function(req, res){
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

//Create new camp ground
router.post("/",isLoggedIn, function(req, res){
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

// Show form to create new campground
router.get("/new",isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

//Shows more info about a campground
router.get("/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp3){
        if(err){console.log(err)}else{
            res.render("campgrounds/show", {camp : camp3});
        }
    })
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect("/login")
}

module.exports = router;