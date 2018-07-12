const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const Account = require('../models/account');
import {auth} from '../config/config.json';

/*
 https://apps.twitter.com/app/15436660/settings
 app: nodejs_mentoring_program
*/

passport.use(new TwitterStrategy(
    {
        consumerKey: auth.TWITTER_CONSUMER_KEY,
        consumerSecret: auth.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:8080/login/twitter/callback"
    },
    Account.twitter_authenticate
));