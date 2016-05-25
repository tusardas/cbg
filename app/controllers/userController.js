var cbgService = require('../services/cbgService');
module.exports = {
    verifyUser : function (req, res) {
        return cbgService.verifyUser(req, res);
    }
};
