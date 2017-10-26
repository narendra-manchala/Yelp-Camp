var mongoosee = require("mongoose");
var Comment = require("./models/comment")
var Campground = require("./models/campground")


var data = [
    {
        name:'Salmon Creek',
        image:"https://upload.wikimedia.org/wikipedia/commons/0/05/Biskeri-_Camping_I_IMG_7238.jpg",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
    },
    {
        name:'Granite Hill',
        image:"http://www.blog.weekendthrill.com/wp-content/uploads/2016/07/071416_1116_25AwesomeCa21.png",
        description:"tThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
    },
    {
        name:'Mountain Rest',
        image:"https://www.caravancampingsites.co.uk/broomfield.jpg",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
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

