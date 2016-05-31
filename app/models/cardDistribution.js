var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Player = require('./player');
var Card = require('./card');

var CardDistributionSchema = new Schema({
    cdType: { type: Number, required: true},
    _player: {type: Schema.Types.ObjectId, ref: Player},
    _cards: [{type: Schema.Types.Object, ref: Card}],
    _winning_reserve: [{type: Schema.Types.Object, ref: Card}]
});

module.exports = mongoose.model('CardDistribution', CardDistributionSchema);