var express = require("express");
var router = express.Router();
var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
var LocalSrategy 	= require("passport-local");
var User = require("../models/user");
var middleware = require("../middleware"); 



router.get("/", function(req, res){
	res.render("landing");
});

//===========
//AUTH routes
//===========

router.get("/register", (req, res) =>{
	res.render("register");
});

router.post("/register", (req, res) =>{
	User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	})
});


router.get("/login", (req, res) =>{
	res.render("login");
});

router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) ,(req, res) =>{

});

router.get("/logout", (req, res) =>{
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/campgrounds");
});


module.exports = router;