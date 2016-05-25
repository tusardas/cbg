var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
    name: { type: String, required: true},
    file: { type: String, index: { unique: true } },
    countryCode : { type: String},
    dob : {type : Date},
    tests_played: { type: Number},
    odis_played: { type: Number},
    test_runs: { type: Number},
    odi_runs: { type: Number},
    test_highest_runs: { type: Number},
    odi_highest_runs: { type: Number},
    test_runs_avg : { type: Number},
    odi_runs_avg : { type: Number},
    test_100s: { type: Number},
    test_50s: { type: Number},
    odi_100s: { type: Number},
    odi_50s: { type: Number},
    test_wickets: { type: Number},
    odi_wickets: { type: Number},
    test_10ws: { type: Number},
    test_5ws: { type: Number},
    odi_5ws: { type: Number},
    test_bbm_w: { type: Number},
    test_bbm_r: { type: Number},
    odi_bbm_w: { type: Number},
    odi_bbm_r: { type: Number},
    shuffle: [{ type: Number}]
});

module.exports = mongoose.model('Card', CardSchema);