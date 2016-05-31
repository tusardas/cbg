var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GameSettings = require('./gameSettings');
var GameState = require('./gameState');
var Player = require('./player');
var CardDistribution = require('./cardDistribution');

var GameSchema = new Schema({
    _gameSettings: {type: Schema.Types.Object, ref: GameSettings},
    _gameState: {type: Schema.Types.Object, ref: GameState},
    _players: [{type: Schema.Types.Object, ref: Player}],
    _cardDistributions: [{type: Schema.Types.Object, ref: CardDistribution}]
});

module.exports = mongoose.model('Game', GameSchema);