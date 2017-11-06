var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//add comments form
router.get("/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){console.log(err)}else{
            // console.log(campground)
            res.render("comments/new", {campground:campground});
        }
    })

})

//add comments logic
router.post("/",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    // console.log(req.user.username)
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

//edit form for comments
router.get("/:comment_id/edit",commmentAuthentication, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){console.log(err)}else{
            // console.log(campground)
            res.render("comments/edit", {campground_id:req.params.id, comment:comment});
        }
    })
})

router.post("/:comment_id/edit",commmentAuthentication, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){console.log(err)}else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//logic to delete a comment

router.post("/:comment_id/",commmentAuthentication, function(req, res){
    console.log("==========")
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("/campgrounds/"+req.params.id)
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//middle ware

function commmentAuthentication(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                res.redirect("back")
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect("back")
                }
            }
        })
    }else{
        res.redirect("/login")
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect("/login")
}


module.exports = router;