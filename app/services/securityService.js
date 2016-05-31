var bcrypt = require('bcrypt-nodejs');
module.exports = {
    getEncryptedPassword: function(plainTextPassword, salt) {
        salt = salt === "" ? bcrypt.genSaltSync() : salt;
        encryptedPassword = bcrypt.hashSync(plainTextPassword, salt);
        return {salt : salt, encryptedPassword : encryptedPassword};
    },
    comparePassword: function(userInputPlainTextPassword, saltFromDb, encryptedPasswordFromDb) {
        var passResult = this.getEncryptedPassword(userInputPlainTextPassword, saltFromDb);
        return passResult["encryptedPassword"] === encryptedPasswordFromDb;
    }
};