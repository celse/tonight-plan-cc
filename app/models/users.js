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

