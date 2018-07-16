const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Account = require('../models/account');
import {auth} from '../config/config.json';

/*
 https://developers.facebook.com/apps/219032688732001/settings/basic/
 app: nodejs_mentoring_program
*/

passport.use(new FacebookStrategy(
    {
        clientID: auth.FACEBOOK_APP_ID,
        clientSecret: auth.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8080/login/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    Account.facebook_authenticate
));