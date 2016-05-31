var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSettingsSchema = new Schema({
    numberOfPlayers: { type: Number, required: true}, // 1 = single-player, 2 = multiplayer
    cricketFormat: { type: String, required: true}, //'test', 'odi', 't20'
    gameMode: { type: Number, required: true}, // 1 = easy, 2 = medium, 3 = hard
    cardsPerPlayer: {type: Number, required: true}
});

module.exports = mongoose.model('GameSettings', GameSettingsSchema);