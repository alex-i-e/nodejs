const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

import { users } from '../config/users.json';
import { secret } from '../config/config.json';
import verifyToken from './verifyToken';

class JWTPassport {
    constructor() {
        this.token;
        this.secret = secret;
        this.exiration = 10; // 60 * 60 === '1h'
    }

    getJWTSign(obj) {
        this.token = jwt.sign(
            obj, 
            this.secret, 
            { expiresIn: this.exiration }
        );
    }

    checkVerified() {
        jwt.verify(
            this.token, 
            this.secret, 
            function(err, decoded) {
                /*
                TokenExpiredError:
                name:
                message:
                expiredAt:
                */
                if (err) { console.log(err); return; }

                console.log(decoded) // bar
                console.log(decoded.username) // bar
            });
    }
}

const jwtPassport = new JWTPassport();

router.post('/auth', function postAuthorization(req, res) {    
    const token = req.headers['x-access-token'];
    console.log('token >>> ', token);

    // const jwtObject = {
    //     "email": req.body.username,
    //     "username": req.body.email
    // };
    jwtPassport.getJWTSign({});
    
    // setTimeout(()=> {
    //     console.log(jwtPassport.checkVerified());
    // }, 1000);
    

    let result = {};

    const currentUser = users
        .find(user =>user.username === req.body.username);
    if (currentUser) {
        if (currentUser.password === req.body.password) {
            result = {
                "code": 200,
                "message": "OK",
                "data": {
                    "user": {
                        "email": currentUser.email,
                        "username": currentUser.username    
                    }
                },
                "token": jwtPassport.token
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

