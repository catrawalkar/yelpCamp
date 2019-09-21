var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments")

var data = [
    {
       name: "Clouds",
       image: "https://source.unsplash.com/RMicIhNOOIg",
       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    },{
        name: "mountains",
        image: "https://source.unsplash.com/qhB6S2dts8A",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    },{
        name: "Valley",
        image: "https://source.unsplash.com/5Rhl-kSRydQ",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    }
];

function seedDB(){
    //Remove Campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed all data");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        
                    }else{
                        console.log("added");
                        Comment.create({
                            text: "This is a great place",
                            author: "Daniel"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("New comment");
                            }
                        });
                    }
                });
            });
        }
    });

}

module.exports = seedDB;