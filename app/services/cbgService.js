var User = require('../models/user');
var Player = require('../models/player');
var Game = require('../models/game');
var PlayedCard = require('../models/playedCard');
var GameSettings = require('../models/gameSettings');
var GameState = require('../models/gameState');
var Card = require('../models/card');
var CardDistribution = require('../models/cardDistribution');

var securityService = require('./securityService');

module.exports = {
    verifyUser : function (req, res) {
        var username = req.body.email;
        var password = req.body.password;
        if(username === 'cpu') {
            return fallback(res); //restricting login for cpu user
        }
        User.findOne({
            username : username
        }, 
        function(err, user) {
            if(err) {
                console.log("error in authenticating user ---> " + err);
                return fallback(res);
            }
            if(user !== null) {
                var authVerificationStatus = securityService.comparePassword(password, user.salt, user.password);
                console.log("authVerificationStatus for user '" + user.username + "' ---> " + authVerificationStatus);
                if(authVerificationStatus) {
                    user.password = '';
                    user.salt = '';
                    //res.json(user);
                    return getPlayerAndExistingGame(res, user);
                }
            }
            return fallback(res);
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
        console.log("server side request reached---------------------------")
        Game.findOne({ _id: req.body.gameid}, function(err, game) {
            if (err) {
                console.log("error in loading player while creating new game ---> " + err);
                return fallback(res);
            }

            if(game === null) {
                return fallback(res);
            }
            else {
                console.log("game object found --------------------------------");
                return saveTurn(game, req, res);
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
    var cardsPerPlayer = 2;
    
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
    
    //var firstPlayer = parseInt((Math.random()*10)%2, 10) === 0 ? player1 : player2; //toss for nextTurn
    var gameState = new GameState({ 
        gameStatus : 1, 
        //_nextPlayer : firstPlayer
        _nextPlayer : player1
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

function saveTurn(game, req, res) {
    console.log("req.body.playerId -----> " + req.body.playerId)
    var playerId = req.body.playerId;
    var cardId = req.body.cardid;
    var attributeId = req.body.attributeId;

    var players = game._players;
    console.log("players -----------> " + players);
    var cardDistributions = game._cardDistributions;
    console.log("cardDistributions -----------> " + cardDistributions);
    
    var playersSize = players.length;
    var player, nextPlayer;
    for(var i = 0; i<playersSize; i++) {
        if(players[i]._id == playerId) {
            player = players[i];
        }
        else {
            nextPlayer = players[i];
        }
    }
    console.log("player ----------------> " + player);
    
    var cardDistribution;
    var unchangedCardDistribution;
    for(var i = 0; i<playersSize; i++) {
        console.log("form cd player ----------------> " + cardDistributions[i]._player);
        console.log("playerId ----------------> " + playerId);
        if(cardDistributions[i]._player == playerId) {
            cardDistribution = cardDistributions[i];
        }
        else {
            unchangedCardDistribution = cardDistributions[i];
        }
    }
    
    var card;
    var cards = cardDistribution._cards;
    var cardsSize = cards.length;
    for(var i = 0; i<cardsSize; i++) {
        if(cards[i]._id == cardId) {
            card = cards[i];
            break;
        }
    }

    console.log("before cardDistribution._cards.length ----------------> " + cardDistribution._cards.length);
    cardDistribution._cards.pop(card);
    console.log("after cardDistribution._cards.length ----------------> " + cardDistribution._cards.length);

    console.log("cardDistribution ----------------> " + cardDistribution);
    console.log("card ----------------> " + card);
    console.log("attributeId ----------------> " + attributeId);
    
    var gameState = game._gameState;
    var playedCards = gameState._playedCards;
    if(playedCards !== undefined) {
        playedCards = new Array();
    }
    
    var playedCard = new PlayedCard({
        _player: playerId,
        _card: card,
        attributePlayed : attributeId
    });
    
    playedCards.push(playedCard);
    gameState._nextPlayer = nextPlayer;
    gameState._playedCards = playedCards;
    game._gameState = gameState;
    var updatedCardDistributions = new Array();
    updatedCardDistributions.push(cardDistribution);
    updatedCardDistributions.push(unchangedCardDistribution);
    game._cardDistributions = updatedCardDistributions;
    game.markModified('_gameState');
    game.markModified('_cardDistributions');
    game.save(function(err) {
        if (err) {
            console.log("error updating game ---> " + err);
            return fallback(res);
        }
        res.json(game);
    });
   
    
    
    
}

function fallback(res) {
    res.json({status:"failed"});
}
