'use strict';

// config/passport.js
var TwitterStrategy = require("passport-twitter").Strategy;

//Load up the user model
var User = require("../models/users").User 

//load the auth variables
var confingAuth = require('./auth');

module.exports = function(passport){
    
    passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
    console.log(confingAuth.twitterAuth.callbackURL);
    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================

    passport.use(new TwitterStrategy({
        
        consumerKey    : confingAuth.twitterAuth.clientID,
        consumerSecret : confingAuth.twitterAuth.ClientSecret,
        callbackURL    : confingAuth.twitterAuth.callbackURL,
        passReqToCallback : true 
    },
    
    function (req, token, refreshToken, profile, done) {
		process.nextTick(function () {
		   User.findOne({ 'twitter.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
				    return done(null, user);
				} else {
					var newUser = new User();

					newUser.twitter.id = profile.id;
					newUser.twitter.displayName = profile.displayName;
					

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));


};
