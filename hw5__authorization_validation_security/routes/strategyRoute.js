const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../controllers/localPassport');
require('../controllers/facebookPassport');
require('../controllers/twitterPassport');
require('../controllers/googlePassport');

router.post('/local',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        res.status(200).redirect('/local-success');
    });

router.get('/facebook',
    passport.authenticate('facebook', {
        authType: 'rerequest',
        scope: ['manage_pages']
    }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login/facebook-error'}),
    function (req, res) {
        res.status(200).redirect('/facebook-success');
    });

router.get('/twitter',
    passport.authenticate('twitter')
);

router.get('/twitter/callback',
    passport.authenticate('twitter', {failureRedirect: '/login/twitter-error'}),
    function (req, res) {
        res.status(200).redirect('/twitter-success');
    });

router.get('/google',
    passport.authenticate('google', {scope: ['profile']})
);

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/login/google-error'}),
    function (req, res) {
        res.status(200).redirect('/google-success');
    });

module.exports = router;