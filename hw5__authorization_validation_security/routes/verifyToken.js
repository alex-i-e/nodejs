const jwt = require('jsonwebtoken');


import {secret} from '../config/config.json';


export function verifyToken(err, req, res, next) {
    if (err) {
        next(new Error('Error happened when verify token'));
    }

    const token = req.headers['x-access-token'];

    if (!token)
        return res.status(403)
            .send({auth: false, message: 'No token provided.'});

    jwt.verify(token, secret, function (err, decoded) {
        if (err)
            return res.status(500)
                .send({auth: false, message: 'Failed to authenticate token.'});

        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}