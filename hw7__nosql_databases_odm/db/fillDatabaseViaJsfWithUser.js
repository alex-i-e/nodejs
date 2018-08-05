import {db} from "../config/config.json";
import mongoose from 'mongoose';

const jsf = require('json-schema-faker');
const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;

mongoose.connect(url, {useNewUrlParser: true});

const UserModel = mongoose.model('User', require('../models/User'));
const userSchema = {
    "type": "object",
    "properties": {
        "user": {
            "type": "object",
            "properties": {
                "username": {
                    "type": "string",
                    "faker": "name.findName"
                },
                "email": {
                    "type": "string",
                    "format": "email",
                    "faker": "internet.email"
                },
                "password": {
                    "type": "string",
                    "minLength": 8
                },
                "passwordHash": {
                    "type": "string",
                    "pattern": "[a-z0-9]{64}"
                }
            },
            "required": [
                "username",
                "email",
                "password",
                "passwordHash"
            ]
        }
    },
    "required": [
        "user"
    ],
    "definitions": {
        "positiveInt": {
            "type": "integer",
            "minimum": 0,
            "exclusiveMinimum": true
        }
    }
};

jsf.resolve(userSchema).then(function (sample) {
    console.log('JSF USER schema');
    console.log(sample.user);
    // "[object Object]"

    const userInstance = new UserModel();
    console.log(' >>> userInstance=', userInstance);

    userInstance.username = sample.user.username;
    userInstance.email = sample.user.email;
    userInstance.password = sample.user.password;
    userInstance.passwordHash = sample.user.passwordHash;

    userInstance.save(function (err, data) {
        if (!err) console.log('Success!');
        console.log(' >>> user data=', data);
    });


    console.log(sample.user.username);
});