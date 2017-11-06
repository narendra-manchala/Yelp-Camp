var express = require("express");
var router = express.Router();
var Campground =require("../models/campground")

//Show all campgrounds
router.get("/", function(req, res){
    // console.log(req.user);
    Campground.find({}, function(err, camp){
        if(err){
            console.log(err);
        }else{
            // console.log(camp1)
            res.render("campgrounds/campgrounds", {places:camp, currentUser: req.user});
        }
    })
});

//Create new camp ground
router.post("/",isLoggedIn, function(req, res){
    name=req.body.name;
    image=req.body.image;
    desc = req.body.description;
    // res.send("you hit post")
    var author = {
        id : req.user._id,
        username : req.user.username,
    }

    var newCampground = {name:name, image:image, description: desc, author:author };
    Campground.create(newCampground, function(err, camp){
        if(err){
            console.log(err);
        }else{
            console.log(camp);
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err){console.log(err)}else{
            res.render("campgrounds/show", {camp : camp});
        }
    })
})

//Show form to edit campground

router.get("/:id/edit",checkCampgroundOwnership, function (req, res) {

        Campground.findById(req.params.id, function(err, camp){

                    res.render("campgrounds/edit", {camp: camp})

        })

})

//logic for updating campground
router.post("/:id/edit",checkCampgroundOwnership, function(req, res){

    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, camp){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

// delete a campground
router.post("/:id",checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function (err, camp) {
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    })
})

//middleware

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, camp){
            // does user own
            if(err){
                res.redirect("back")
            }else{
                // console.log(camp);
                if(camp.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }

            }
        })
    }else{
        // console.log("You are not logged in")
        res.redirect("/login")
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect("/login")
}

module.exports = router;