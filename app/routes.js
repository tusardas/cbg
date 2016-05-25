var userController = require('./controllers/userController');
var gameController = require('./controllers/gameController');

module.exports = function(app) {
    // api ---------------------------------------------------------------------
    // home page
	app.get('/', function(req, res) {
		res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
    
	// api ---------------------------------------------------------------------
	// authenticate user
	app.post('/rest/user', function(req, res) {
        userController.verifyUser(req, res);
	});
    
    // api ---------------------------------------------------------------------
	// save new game
	app.post('/rest/game', function(req, res) {
		// use mongoose to save new game
		gameController.createGame(req, res);
	});
    
    // api ---------------------------------------------------------------------
	// delete game
	app.post('/rest/delete', function(req, res) {
		// use mongoose to save new game
		gameController.deleteGame(req, res);
	});
};