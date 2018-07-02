const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Account = require('../models/account');
import {auth} from '../config/config.json';

/*
 https://console.developers.google.com
 https://developers.google.com/identity/protocols/OpenIDConnect
 https://console.developers.google.com/apis/credentials?project=awesome-dogfish-209011&folder&organizationId
 app: nodejs-mentoring-program
*/

module.exports = function GooglePassportInit(proposedPassport) {
    return proposedPassport.use(new GoogleStrategy(
        {
            clientID: auth.GOOGLE_CLIENT_ID,
            clientSecret: auth.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/login/google/callback"
        },
        Account.google_authenticate
    ));
};