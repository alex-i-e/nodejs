const bcrypt = require('bcrypt');

import {users} from '../config/users.json';

function findUser(username, callback) {
    const currentUser = users
        .find(user => user.username === username);

    if (currentUser) {
        callback(null, currentUser);
    } else {
        callback(new Error('User not found!'));
    }
}

function findUserById(id, callback) {
    const currentUser = users
        .find(user => user.id === id);

    if (currentUser) {
        callback(null, currentUser);
    } else {
        callback(new Error('User not found!'));
    }
}

module.exports = {
    authenticate: (username, password, done) => {
        findUser(username, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }

            // Always use hashed passwords and fixed time comparison
            bcrypt.compare(password, user.passwordHash, (err, isValid) => {
                if (err) {
                    return done(err)
                }
                if (!isValid) {
                    return done(null, false)
                }
                return done(null, user)
            })
        })
    },
    serializeUser: (user, cb) => {
        cb(null, user.id);
    },
    deserializeUser: (id, cb) => {
        findUserById(id, function (err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    }
};