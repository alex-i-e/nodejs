import CryptHandler from "../controllers/hashHandler";

const express = require('express');
const router = express.Router();

const cryptHandler = new CryptHandler();


module.exports = function localStrategyRoute(passport) {
    const localPassport = require('../controllers/localPassport')(passport);

    (async () => {
        console.log(' SALT >>> ', await cryptHandler.genSalt());

        const hash1 = await cryptHandler.get('12345678');
        console.log(' HASH-1 with default-SALT >>> ', hash1);

        const hash2 = await cryptHandler.get('12345678');
        console.log(' HASH-2 with default-SALT >>> ', hash2);
        console.log(' VERIFY HASH-1  >>> ',
            await cryptHandler.verify('12345678', hash2));
    })();

    return router.post('/login',
        localPassport.authenticate('local', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });
};