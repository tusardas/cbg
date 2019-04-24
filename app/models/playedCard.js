var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Player = require('./player');
var Card = require('./card');

var PlayedCardSchema = new Schema({
    _player: {type: Schema.Types.ObjectId, ref: Player},
    _card: {type: Schema.Types.Object, ref: Card},
    attributePlayed : { type: String, required: true}
});

module.exports = mongoose.model('PlayedCard', PlayedCardSchema);