var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Player = require('./player');
var PlayedCard = require('./playedCard');

var GameStateSchema = new Schema({
    gameStatus: { type: Number, required:true}, // 1 = in progress, 2 = paused, 3 = finished
    _nextPlayer: {type: Schema.Types.Object, ref: Player},
    _playedCards: [{type: Schema.Types.Object, ref: PlayedCard}]
});

module.exports = mongoose.model('GameState', GameStateSchema);