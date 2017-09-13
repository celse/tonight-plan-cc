'use strict';

var path = process.cwd();
var  ClickHander = require(path+ '/app/controllers/serverHandler.js');

module.exports = function(app, passport){
    
    var clickHander = new ClickHander();
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }

    app.route('/')
		.get(function (req, res) {
		    res.sendFile(path + '/public/home.html');
		});
    
    app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
    app.route('/bars')
		.get(isLoggedIn,clickHander.userBarGet);
    
    /***** twitter authorization authorize authenticate *****/
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));
    
   app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/'
		})); 
    
    /***** API route *****/
    app.route('/api/bars')
		.get(isLoggedIn,clickHander.userBarGet);
	app.route('/api/bars/:id')	
		.delete(isLoggedIn,clickHander.userBarDel);
		
   
    app.route('/api/')
        .get(function(req, res){
            console.log('PAGE INIT');    
            clickHander.pageLoad(req, res);
        })
        
    app.route('/api/:id')
        .get(function(req, res){
            console.log('je suis la');    
            clickHander.searchClick(req, res);
        })
        .post(function(req, res){
            console.log('je suis ici');
            clickHander.selectBar(req, res);
        });
};
