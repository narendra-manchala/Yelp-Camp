var mongoosee = require("mongoose");
var Comment = require("./models/comment")
var Campground = require("./models/campground")


var data = [
    {
        name:'Salmon Creek',
        image:"https://upload.wikimedia.org/wikipedia/commons/0/05/Biskeri-_Camping_I_IMG_7238.jpg",
        description: "this is a post"
    },
    {
        name:'Granite Hill',
        image:"http://www.blog.weekendthrill.com/wp-content/uploads/2016/07/071416_1116_25AwesomeCa21.png",
        description:"this is another post"
    },
    {
        name:'Mountain Rest',
        image:"https://www.caravancampingsites.co.uk/broomfield.jpg",
        description: "this is yet an another post "
    }
]


function seedDB(){
    Campground.remove({}, function(err){
        if(err){console.log(err)}else{
            console.log("removed")
            data.forEach(function(seed){
                Campground.create(seed, function(err, camp){
                    if(err){console.log(err)}else{
                        console.log("New Camp ground created");
                        Comment.create({
                            author: "a",
                            text: "this is a comment"
                        }, function(err, comment){
                            if(err){console.log(err)}else{
                                camp.comments.push(comment);
                                camp.save();
                                console.log("Created new comment");
                            }
                        })
                    }
                })
            })
        }
    })
}


module.exports = seedDB;

