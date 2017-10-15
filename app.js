var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/yelp_camp');

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

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
    Campground.find({}, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds", {places:camp});
        }
    })
});

app.post("/campgrounds", function(req, res){
    name=req.body.name;
    image=req.body.image;
    // res.send("you hit post")
    var newCampground = {name:name, image:image};
    Campground.create(newCampground, function(err, camp){
        if(err){
            console.log(err);
        }else{
            // console.log(camp);
            res.redirect("/campgrounds");
        }
    } )
    // campgrounds.push(newCampground)
});

app.get("/campgrounds/new", function(req, res){
    res.render("new")
});

app.listen(3000, "localhost", function(){
    console.log("Yelp camp has started");
});