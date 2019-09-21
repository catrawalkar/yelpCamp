var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {camp: foundCampground});
       }
    });
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
   Campground.findById(req.params.id,function(err, foundCampground) {
       if(err){
           console.log(err);
       }else{
           Comment.create(req.body.comment, function(err,comment){
              if(err){
                  req.flash("error", "Something went wrong.")
                  console.log(err);
              }else{
                  //add id and username to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  foundCampground.comments.push(comment);
                  foundCampground.save();
                  req.flash("success", "Successfully added comment.")
                  res.redirect("/campgrounds/"+foundCampground._id);
              }
           });
        }
   });
});

//COMMENTS EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err);
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                console.log(err);
            }
            res.render('comments/edit', {camp: foundCampground, comment: foundComment});
        });
    });
});

//COMMENTS UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
        }
        res.redirect("/campgrounds/"+ req.params.id);
    });
});

//COMMENTS DELETE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log(err);
       }
       req.flash("success", "Successfully deleted your comment.")
       res.redirect("/campgrounds/"+ req.params.id);
    });
});

module.exports = router;