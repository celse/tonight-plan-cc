var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    
    session = require('express-session'),
    bodyParser = require('body-parser');
    
    
var app = express();

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI,{
  useMongoClient: true,
});
mongoose.Promise = global.Promise;


app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));


// Configure server to parse JSON for us
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

app.use(session({
        secret: 'nigthlifeforcelsedynamicwebapp',
        resave: false,
        saveUninitialized:true
    }))

app.use(passport.initialize());
app.use(passport.session());
//app.options('*', cors()); 


routes(app, passport);

var port = process.env.PORT||8080;

app.listen(port, function(){
    console.log('Node.js listening on port : '+port+'...');
});

