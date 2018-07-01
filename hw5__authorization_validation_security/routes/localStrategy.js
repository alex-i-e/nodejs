const express = require('express');
const router = express.Router();

module.exports = function localStrategyRoute(passport) {
    const localPassport = require('../controllers/localPassport')(passport);

    return router.post('/login',
        localPassport.authenticate('local', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/success');
        });
};