var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX ROUTE
router.get("/", function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req,res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    req.body.campground.author = author;
    Campground.create(req.body.campground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log("inserted successfully");
        }
    });
    res.redirect("/campgrounds");
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
          console.log(err);
      }else{
          res.render("campgrounds/show", {camp: foundCampground});
      }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect('/back');
        }
        res.render("campgrounds/edit", {camp: foundCampground});
    });
});

//UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);    
        }
    });
});

//DELETE ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
       }
       res.redirect('/campgrounds');
    });
});

module.exports = router;