var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
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

middlewareObj.checkCommentOwnership = function(req, res, next){
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

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect("/login")
}

module.exports = middlewareObj