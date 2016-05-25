var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Player = require('./player');
var Game = require('./game');
var Card = require('./card');

var CardDistributionSchema = new Schema({
    cdType: { type: Number, required: true},
    player: {type: Schema.Types.ObjectId, ref: Player},
    cards: [{type: Schema.Types.Object, ref: Card}]
});

module.exports = mongoose.model('CardDistribution', CardDistributionSchema);