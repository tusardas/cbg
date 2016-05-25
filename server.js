// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8081; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(database.url),
    User = require('./app/models/user'),
    Player = require('./app/models/player'),
    Card = require('./app/models/card'); 	// connect to mongoDB database on modulus.io

var cpuUser = new User({
	username: 'cpu',
	password: 'cpu'
});
cpuUser.save(function(err) {
    if (err) {
        console.log("error saving cpu user, ignore if already exists ---> " + err);
        //throw err;
    }
    else {
        new Player({ 
            nickname: cpuUser.username,
            _user:cpuUser
        }).save(function(err) {
            if (err) {
                console.log("error saving cpu player, ignore if already exists ---> " + err);
                //throw err;
            }
        });
    }
});

var testUser = new User({
	username: 'tusar',
	password: '123'
});
testUser.save(function(err) {
    if (err) {
        console.log("error saving test user, ignore if already exists ---> " + err);
        //throw err;
    }
    else {
        new Player({ 
            nickname: testUser.username,
            _user:testUser
        }).save(function(err) {
            if (err) {
                console.log("error saving test player, ignore if already exists ---> " + err);
                //throw err;
            }
        });
    }
});


app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
