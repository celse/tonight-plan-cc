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
/*
'ClientSecret' : process.env.TWITTER_SECRET,
        'callbackURL' : process.APP_URL+'auth/twitter/callback'
*/
    passport.use(new TwitterStrategy({
        
        consumerKey    : confingAuth.twitterAuth.clientID,
        consumerSecret : confingAuth.twitterAuth.ClientSecret,
        callbackURL    : confingAuth.twitterAuth.callbackURL,
        passReqToCallback : true 
    },
    /*function(req, token, tokenSecret, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.username    = profile.username;
                            user.twitter.displayName = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();

                        newUser.twitter.id          = profile.id;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session

                user.twitter.id          = profile.id;
                 user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });

    }));
    */
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
/*
    function (token, refreshToken, profile, done) {
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

*/