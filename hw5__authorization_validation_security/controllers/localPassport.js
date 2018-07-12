const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/account');

passport.use(new LocalStrategy(Account.authenticate));