var cbgService = require('../services/cbgService');
module.exports = {
    createGame : function (req, res) {
        return cbgService.createGame(req, res);
    },
    deleteGame : function (req, res) {
        return cbgService.deleteGame(req, res);
    } 
};
