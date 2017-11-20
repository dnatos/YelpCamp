var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); 

//=================
//CAMPGROUND ROUTES
//=================

//Index show all campgrounds
router.get("/campgrounds", function(req, res){
	//Get all the campgrounds
	Campground.find({}, function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}

	});
	
});

//Create new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampgoround = {name: name, price: price, img: image, description: description, author: author};


	Campground.create(newCampgoround, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

//New campground form
 router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
 	res.render("campgrounds/new");
 });

//Show - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
	//find the campgraound with the rovided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campgrounf not found");
			res.redirect("back");
		}else{
			res.render("campgrounds/show",{campground: foundCampground});//the campground variable we can use at show.ejs files in order to retrive the data that we've taken
		}
	});
	
});


//Edit campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,(req, res) =>{
		Campground.findById(req.params.id, (err, foundCampground) =>{
			res.render("campgrounds/edit", {campground: foundCampground});
				
		});
});

//Update campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) =>{
	//var data = {name: req.body.name, img: req.body.image, description: req.body.description} -> this is one solution

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
		if(err){
			res.redirect("/campgrounds");
		}
		res.redirect("/campgrounds/" + req.params.id);
	});
});

//Destroy campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});





module.exports = router;