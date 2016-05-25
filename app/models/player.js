var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('./user');

var PlayerSchema = new Schema({
    nickname: { type: String, required: true},
    _user: {type: Schema.Types.ObjectId, ref: User, index: { unique: true }}
});

module.exports = mongoose.model('Player', PlayerSchema);