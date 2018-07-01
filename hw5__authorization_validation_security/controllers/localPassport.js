const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/account');

module.exports = function localPassportInit(localPassport) {
    localPassport.serializeUser(Account.serializeUser);
    localPassport.deserializeUser(Account.deserializeUser);

    return localPassport.use(new LocalStrategy(Account.authenticate));
};