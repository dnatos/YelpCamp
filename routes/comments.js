var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middleware = require("../middleware"); 

//===================
//Comments routes
//===================

//New comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
			if(err){
				console.log(err);
			} else{
				res.render("comments/new", {campground: campground});
			}
	});
});
//Create Comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong")
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id );
				}
			})
		}
	});
});

//Comments edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
	Campground.findById(req.params.id, (err, foundCampground) =>{
		if(err || !foundCampground){
			req.flash("error", "Something went wrong! I can't update the comment");
			return res.redirect("back");
		}

		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err){
				res.redirect("back")
			} else{
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});
	

//Update commetns
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err)=>{
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Delete comments
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}

	});
});

module.exports = router;