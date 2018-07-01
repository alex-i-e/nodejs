const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/account');

module.exports = function localPassportInit(localPassport) {
    return localPassport.use(new LocalStrategy(Account.authenticate));
};