var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Player = require('./player');
var CardDistribution = require('./cardDistribution');

var GameSchema = new Schema({
    gameType: { type: Number, required: true}, // 1 = single-player, 2 = multiplayer
    gameState: { type: Number, required:true}, // 1 = in progress, 2 = paused, 3 = finished
    players: [{type: Schema.Types.Object, ref: Player}],
    resources: [{type: Schema.Types.Object, ref: CardDistribution}]
});

module.exports = mongoose.model('Game', GameSchema);