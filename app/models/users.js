var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    twitter:{
        id: String,
    	displayName: String,
    	//username: String,
    	//token: Number,
    },
	bars: Array,
	lastSearch: String
});

var User = mongoose.model('User', userSchema);
module.exports = {
	User : User
};

/*

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
    attendees: Array,
    barId: String
});

module.exports = mongoose.model('Bar', Bar);
*/
/*
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    bars: Array,
    facebook: {
    	id: String,
    	displayName: String
    },
    lastSearch: String
});

module.exports = mongoose.model('User', User);

*/
/*


*/