const express = require('express');
const router = express.Router();

module.exports = function strategyRoute(passport) {
    const localPassport = require('../controllers/localPassport')(passport);
    const facebookPassport = require('../controllers/facebookPassport')(localPassport);
    const twitterPassport = require('../controllers/twitterPassport')(facebookPassport);
    const googlePassport = require('../controllers/googlePassport')(twitterPassport);

    router.post('/local',
        googlePassport.authenticate('local', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/local-success');
        });

    router.get('/facebook',
        googlePassport.authenticate('facebook', {
            authType: 'rerequest',
            scope: ['manage_pages']
        }));

    router.get('/facebook/callback',
        googlePassport.authenticate('facebook', {failureRedirect: '/login/facebook-error'}),
        function (req, res) {
            res.redirect('/facebook-success');
        });

    router.get('/twitter',
        googlePassport.authenticate('twitter')
    );

    router.get('/twitter/callback',
        googlePassport.authenticate('twitter', {failureRedirect: '/login/twitter-error'}),
        function (req, res) {
            res.redirect('/twitter-success');
        });

    router.get('/google',
        googlePassport.authenticate('google', {scope: ['profile']})
    );

    router.get('/google/callback',
        googlePassport.authenticate('google', {failureRedirect: '/login/google-error'}),
        function (req, res) {
            res.redirect('/google-success');
        });

    return router;
};