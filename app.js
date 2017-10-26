var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
Campground = require("./models/campground");

mongoose.connect('mongodb://localhost/yelp_camp');



app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, camp1){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds", {places:camp1});
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
    res.render("new")
});

app.get("/campgrounds/:id",function(req, res){
    Campground.findById(req.params.id, function(err, camp3){
        if(err){console.log(err)}else{
            // console.log(typeof camp3);
            // console.log(camp3.name);
            res.render("show", {camp : camp3});
        }
    })
})

app.listen(3000, "localhost", function(){
    console.log("Yelp camp has started");
});