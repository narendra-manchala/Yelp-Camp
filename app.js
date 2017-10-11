var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render("landing");
});

var campgrounds = [
    {name:'Salmon Creek', image:"https://upload.wikimedia.org/wikipedia/commons/0/05/Biskeri-_Camping_I_IMG_7238.jpg"},
    {name:'Granite Hill', image:"http://www.blog.weekendthrill.com/wp-content/uploads/2016/07/071416_1116_25AwesomeCa21.png"},
    {name:'Mountain Rest', image:"https://www.caravancampingsites.co.uk/broomfield.jpg"}
]

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {places:campgrounds})
});

app.post("/campgrounds", function(req, res){
    name=req.body.name;
    image=req.body.image;
    // res.send("you hit post")
    var newCampground = {name:name, image:image}
    campgrounds.push(newCampground)
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req, res){
    res.render("new")
})


app.listen(3000, "localhost", function(){
    console.log("Yelp camp has started");
});