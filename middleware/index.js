
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){

	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) =>{
			if(err || !foundCampground){
				req.flash("error", "Campground not found")
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){ // we use the equals function because the frist is a mongoose object and the req.user._id is a string, and we cannot compare them with == or ===
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please Login first!")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next){
	
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err || !foundComment){
				req.flash("error", "Comment not found")
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){ // we use the equals function because the frist is a mongoose object and the req.user._id is a string, and we cannot compare them with == or ===
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please Login first!")
		res.redirect("back");
	}

}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login first!");
	res.redirect("/login");
}


module.exports = middlewareObj;