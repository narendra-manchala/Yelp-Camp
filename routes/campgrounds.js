var express = require("express");
var router = express.Router();
var Campground =require("../models/campground")

router.get("/campgrounds", function(req, res){
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

router.post("/campgrounds", function(req, res){
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

router.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
});

router.get("/campgrounds/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp3){
        if(err){console.log(err)}else{
            // console.log(typeof camp3);
            // console.log(camp3.name);
            // console.log(camp3)
            res.render("campgrounds/show", {camp : camp3});
        }
    })
})

module.exports = router;