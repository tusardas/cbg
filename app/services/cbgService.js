var User = require('../models/user');
var Player = require('../models/player');
var Game = require('../models/game');
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
                return saveGame(player, res);
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
                    players : {$in : [existingPlayer]},
                    $and : [{
                        $or : [
                            {gameState : 1}, 
                            {gameState : 2}
                        ] 
                    }]
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

function saveGame(player, res) {
    var CARDS_PER_PLAYER = 10;
    //var rand = Math.floor(Math.random()*13);
    //Card.find().skip(rand).limit(CARDS_PER_PLAYER*2).exec(function(err, result) {
    Card.find( { shuffle : { $near : [Math.random(), 0] } } ).limit(2).limit(CARDS_PER_PLAYER*2).exec(function(err, result) {
        User.findOne({ username : 'cpu' }, function(err, cpuUser) {
            if (err) {
                console.log("error finding cpu user ---> " + err);
                return fallback(res);
            }
            Player.findOne({ _user : cpuUser }, function(err, cpuPlayer) {
                if (err) {
                    console.log("error finding cpu player ---> " + err);
                    return fallback(res);
                }
                var cpuCards = new Array();
                var playerCards = new Array();
                for(var i = 0; i < CARDS_PER_PLAYER; i++) {
                    cpuCards.push(result[i]);
                    playerCards.push(result[(CARDS_PER_PLAYER*2)-(i+1)]);
                }
                saveGameResources(player, cpuPlayer, playerCards, cpuCards, res);
            });
        });
    });
}

function saveGameResources(player, cpuPlayer, playerCards, cpuCards, res) {
    var cpuCd = new CardDistribution({ cdType : 1, player : cpuPlayer, cards: cpuCards});
    var playerCd = new CardDistribution({ cdType : 1, player : player, cards: playerCards});
    var newGame = new Game({gameType: 1, gameState: 1, players: [cpuPlayer, player], resources: [cpuCd, playerCd]});
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
