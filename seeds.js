//This is a file that will empty the DB and add some data after that, in order to test our application

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
			{
				name: "Cloud's rest",
				img: "https://farm9.staticflickr.com/8041/7930201874_6c17ed670a.jpg",
				description: "Based in Washington Dc, we are an extremely fast-growing start-up that offers a very unique product directed toward a specific segment in the media industry. While other tech based companies simply go with the flow, we plunge right through with pure intent to disrupt. Our highly innovative media platform has already taken the industry by storm and we aim to continue our campaign to produce something that our clients/consumers truly benefit from. We’re building a team of inspired, smart, and driven individuals from all sorts of backgrounds, and we are looking for a talented Full Stack PHP developer to join our team."
			},
			{
				name: "River Party",
				img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
				description: "Based in Washington Dc, we are an extremely fast-growing start-up that offers a very unique product directed toward a specific segment in the media industry. While other tech based companies simply go with the flow, we plunge right through with pure intent to disrupt. Our highly innovative media platform has already taken the industry by storm and we aim to continue our campaign to produce something that our clients/consumers truly benefit from. We’re building a team of inspired, smart, and driven individuals from all sorts of backgrounds, and we are looking for a talented Full Stack PHP developer to join our team."
			},
			{
				name: "Ardas",
				img: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg",
				description: "Based in Washington Dc, we are an extremely fast-growing start-up that offers a very unique product directed toward a specific segment in the media industry. While other tech based companies simply go with the flow, we plunge right through with pure intent to disrupt. Our highly innovative media platform has already taken the industry by storm and we aim to continue our campaign to produce something that our clients/consumers truly benefit from. We’re building a team of inspired, smart, and driven individuals from all sorts of backgrounds, and we are looking for a talented Full Stack PHP developer to join our team."
			}
	]

function seedDB(){
	//Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("All campgounds removed!!");
		//add a few campgrounds
		data.forEach(function(seed){
		Campground.create(seed, function(err, campground){
			if(err){
				console.log(err);
			} else{
				console.log("Campground create");
				//create a comment on each campground
				Comment.create(
					{
						text: "This place is great",
						author: "Dimitris Natos"
					}, function(err, comment){
						if(err){
							console.log(err);
						} else{
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment");
						}

					});
			}
		});
		});
	});

	
}

module.exports = seedDB;