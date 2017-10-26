var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Comment = require("./models/comment")
Campground = require("./models/campground");
// Comment = require("./models/comment")
seedDB = require("./seeds")

seedDB()
mongoose.connect('mongodb://localhost/yelp_camp');



app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

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
    Campground.find({}, function(err, camp1){
        if(err){
            console.log(err);
        }else{
            // console.log(camp1)
            res.render("campgrounds/campgrounds", {places:camp1});
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

app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(3000, "localhost", function(){
    console.log("Yelp camp has started");
});