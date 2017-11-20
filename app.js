var express 		= require("express"),
 	app 			= express(),
 	bodyParser 		= require("body-parser"),
 	mongoose 		= require("mongoose"),
 	Campground 		= require("./models/campground"), //Schema setup
 	Comment 		= require("./models/comment"),
 	User 			= require("./models/user"),
 	seedDB 			= require("./seeds"),
 	passport 		= require("passport"),
 	LocalSrategy 	= require("passport-local"),
 	methodOverride	= require("method-override"),
 	flash 			= require("connect-flash");



var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

//seedDB();

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "dimitris natos",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000, function(){
	console.log("The server start at port 3000");
});