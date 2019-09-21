var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                =  require("./models/users"),
    Campground          = require("./models/campgrounds"),
    seedDB              = require("./seeds"),
    Comment             = require("./models/comments"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash");

//REQUIRING ROUTES
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");
    
//seedDB(); Seed the database
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static( __dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

//Passport CONFIG

app.use(require("express-session")({
    secret: "Chinmay",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started:");
});