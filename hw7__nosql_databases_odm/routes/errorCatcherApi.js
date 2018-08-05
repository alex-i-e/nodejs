const express = require('express');
const router = express.Router();

router.get('/*', function throwError(req, res, next) {
    next(new Error('API does not exist yet!'));
});

module.exports = router;