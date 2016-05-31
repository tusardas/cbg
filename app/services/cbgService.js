var User = require('../models/user');
var Player = require('../models/player');
var Game = require('../models/game');
var GameSettings = require('../models/gameSettings');
var GameState = require('../models/gameState');
var Card = require('../models/card');
var CardDistribution = require('../models/cardDistribution');

module.exports = {
    verifyUser : function (req, res) {
        var username = req.body.email;
        var password = req.body.password;
        if(username === 'cpu') {
            password = ''; //restricting login for cpu user
        }
        User.findOne({
            username : username, 
            password : password 
        }, 
        function(err, user) {
            if(err) {
                console.log("error in authenticating user ---> " + err);
                return fallback(res);
            }
            if(user !== null) {
                user.password = '';
                //res.json(user);
                return getPlayerAndExistingGame(res, user);
            }
            else {
                return fallback(res);
            }
        });
    },
    
    createGame : function(req, res) {
        Player.findOne({ _id: req.body.playerid}, function(err, player) {
            if (err) {
                console.log("error in loading player while creating new game ---> " + err);
                return fallback(res);
            }

            if(player === null) {
                return fallback(res);
            }
            else {
                return createGame(player, res);
            }
        });
    },
    
    deleteGame : function(req, res) {
        Game.remove({ _id: req.body.gameid}, function(err) {
            if (err) {
                console.log("error in deleting game ---> " + err);
                res.json({status : "failed"});
            }
            else {
                res.json({status : "success"});
            }
        });
    },
    
    playTurn : function(req, res) {
        Game.findOne({ _id: req.body.gameid}, function(err, game) {
            if (err) {
                console.log("error in loading player while creating new game ---> " + err);
                return fallback(res);
            }

            if(game === null) {
                return fallback(res);
            }
            else {
                return playTurn(game, req.body.cardid, res);
            }
        });
    }
};

function getPlayerAndExistingGame(res, user) {
    Player.findOne({ _user : user }, function(err, existingPlayer) {
        if (err) {
            console.log("error finding player after login ---> " + err);
            return fallback(res);
        }
        if(existingPlayer === null) {
            var newPlayer = new Player({ nickname: user.username, _user:user});
            newPlayer.save(function(err) {
                if (err) {
                    console.log("error saving new player after login ---> " + err);
                    return fallback(res);
                }
                res.json({user:user, player:newPlayer});
            });
        }
        else {
            Game.findOne({
                    _players : {$in : [existingPlayer]}
                },
                function(err, existingGame){
                    if (err) {
                        console.log("error finding game after login ---> " + err);
                        return fallback(res);
                    }
                    res.json({user:user, player:existingPlayer, game:existingGame});
                }
            );
        }
    });
}

function createGame(player1, res) {
    //TODO: will be input from User
    var numberOfPlayers = 2;
    var cricketFormat = "test";
    var gameMode = 1;
    var cardsPerPlayer = 15;
    
    var gameSettings = new GameSettings({
        numberOfPlayers:numberOfPlayers, 
        cricketFormat : cricketFormat,
        gameMode : gameMode,
        cardsPerPlayer : cardsPerPlayer
    });
    
    Card.find( { shuffle : { $near : [Math.random(), 0] } } ).limit(cardsPerPlayer*numberOfPlayers).exec(function(err, result) {
        User.findOne({ username : 'cpu' }, function(err, cpuUser) {
            if (err) {
                console.log("error finding cpu user ---> " + err);
                return fallback(res);
            }
            Player.findOne({ _user : cpuUser }, function(err, player2) {
                if (err) {
                    console.log("error finding cpu player ---> " + err);
                    return fallback(res);
                }
                var cardsPlayer1 = new Array();
                var cardsPlayer2 = new Array();
                for(var i = 0; i < cardsPerPlayer; i++) {
                    cardsPlayer1.push(result[i]);
                    cardsPlayer2.push(result[(cardsPerPlayer*numberOfPlayers)-(i+1)]);
                }
                saveGame(gameSettings, player1, player2, cardsPlayer1, cardsPlayer2, res);
            });
        });
    });
}

function saveGame(gameSettings, player1, player2, cardsPlayer1, cardsPlayer2, res) {
    var cdPlayer1 = new CardDistribution({ 
        cdType : 1, 
        _player : player1, 
        _cards: cardsPlayer2
    });
    var cdPlayer2 = new CardDistribution({ 
        cdType : 1, 
        _player : player2, 
        _cards: cardsPlayer1
    });
    
    var firstPlayer = parseInt((Math.random()*10)%2, 10) === 0 ? player1 : player2; //toss for nextTurn
    var gameState = new GameState({ 
        gameStatus : 1, 
        _nextPlayer : firstPlayer
    });
    
    var newGame = new Game({
        _gameSettings: gameSettings, 
        _gameState: gameState, 
        _players: [player1, player2], 
        _cardDistributions: [cdPlayer1, cdPlayer2]
    });
    newGame.save(function(err) {
        if (err) {
            console.log("error saving new game ---> " + err);
            return fallback(res);
        }
        res.json(newGame);
    });
}

function fallback(res) {
    res.json({status:"failed"});
}
