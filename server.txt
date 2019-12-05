const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const http = require('http');
const https = require('https');

const passport = require('passport');
const MeetupOAuth2Strategy = require('passport-oauth2-meetup').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github").Strategy;

const keys = require("../config");
const chalk = require('chalk');

let user = {}

passport.serializeUser((user,cb) => {
    cb(null,user)
});

passport.deserializeUser((user,cb) => {
    cb(null,user)
});

//Meetup Strategy
passport.use(new MeetupOAuth2Strategy({
    clientID: keys.MEETUP.clientID,
    clientSecret: keys.MEETUP.clientSecret,
    callbackURL: "/auth/meetup/callback",
    autoGenerateUsername: true
  },
  function(token, tokenSecret, profile, done) {
   
      return done(null, user);

  }
));

//Google Strategy
passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Github Strategy
passport.use(new GithubStrategy({
    clientID: keys.GITHUB.clientID,
    clientSecret: keys.GITHUB.clientSecret,
    callbackURL: "/auth/github/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

const app = express();
app.use(cors());
app.use(passport.initialize());

app.get('/auth/meetup', passport.authenticate('meetup'))
app.get('/auth/meetup/callback',
  passport.authenticate('meetup'),
  function(req, res) {
    console.log("It worked!")
    res.redirect('/events');
  });

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));
app.get("/auth/google/callback",
    passport.authenticate("google"),
        (req, res) => {
            res.redirect("/events");
});
app.get("/auth/github", passport.authenticate("github"));
app.get("/auth/github/callback",
    passport.authenticate("github"),
    (req, res) => {
        res.redirect("/events");
    });
app.get("/user", (req, res) => {
    console.log("getting user data!");
    res.send(user);
});

app.get("/auth/logout", (req, res) => {
    console.log("logging out!");
    user = {};
    res.redirect("/");
});

const PORT = 5000;
app.listen(PORT, function () {
    console.log("express has started on port "+ PORT);
    });
