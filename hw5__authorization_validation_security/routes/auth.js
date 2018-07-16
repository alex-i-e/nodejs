const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

import {users} from '../config/users.json';
import {expiration, secret} from '../config/config.json';

router.post('/auth', function postAuthorization(req, res) {
    let result = {};
    const currentUser = users
        .find(user => user.username === req.body.username);

    if (currentUser) {
        if (currentUser.password === req.body.password) {
            const token = jwt.sign(
                {
                    id: currentUser.id
                },
                secret,
                {expiresIn: expiration}
            );

            result = {
                "code": 200,
                "message": "OK",
                "data": {
                    "user": {
                        "email": currentUser.email,
                        "username": currentUser.username
                    }
                },
                "token": token
            };
        } else {
            result = {
                "code": 404,
                "message": "Invalid",
                "data": {
                    "description": "Wrong password!"
                }
            };
        }
    } else {
        result = {
            "code": 404,
            "message": "Not Found",
            "data": {
                "description": "User does not exist!"
            }
        };
    }

    res.json(result);
});

export default router;

