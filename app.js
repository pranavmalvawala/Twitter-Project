const express = require("express");
const bodyParser = require("body-parser");
var TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: 'my little secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.API_KEY,
    consumerSecret: process.env.API_KEY_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/loginpage"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/", function(req, res){
    res.render("home");
});

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/loginpage', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/loginpage');
});

let port = process.env.PORT;
if(port === null || port === ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});

// app.listen(3000, function() {
//     console.log("Server started on port 3000");
//   });
