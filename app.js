const express 				= require("express"),
 			app 						= express(),
 			bodyParser 			= require("body-parser"),
 			mongoose 				= require("mongoose"),
 			Campground 			= require("./models/campground"),
 			Comment 				= require("./models/comment"),
 			User 						= require("./models/user"),
 			seedDB 					= require("./seeds"),
 			passport 				= require("passport"),
 			LocalSrategy 		= require("passport-local"),
 			methodOverride	= require("method-override"),
			flash 					= require("connect-flash"),
	 		dotenv 					=	require("dotenv");


dotenv.config({path: 'variables.env'});

const commentRoutes 		= require("./routes/comments"),
			campgroundRoutes 	= require("./routes/campgrounds"),
			indexRoutes 			= require("./routes/index");


mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB, {useMongoClient: true});

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: process.env.SECRET,
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

app.listen(process.env.PORT, function(){
	console.log("Server started");
});