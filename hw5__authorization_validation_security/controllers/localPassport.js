const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/account');

module.exports = function localPassportInit(proposedPassport) {
    return proposedPassport.use(new LocalStrategy(Account.authenticate));
};