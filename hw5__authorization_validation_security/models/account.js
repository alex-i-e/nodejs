const bcrypt = require('bcrypt');
import {users} from '../config/users.json';

function findUserByName(username, callback) {
    const currentUser = users
        .find(user => user.username === username);

    if (currentUser) {
        callback(null, currentUser);
    } else {
        callback(new Error('User not found!'));
    }
}

function findUserById(type, id, callback) {
    const currentUser = users
        .find(user => user.id === id);

    if (currentUser) {
        callback(null, currentUser);
    } else {
        callback(new Error(`${type.toUpperCase()} User not found!`));
    }
}

module.exports = {
    google_authenticate: (token, tokenSecret, profile, cb) => {
        findUserById('google', profile.id, (err, user) => (
            cb(err, user)
        ));
    },
    twitter_authenticate: (token, tokenSecret, profile, cb) => {
        findUserById('twitter', profile.id, (err, user) => (
            cb(err, user)
        ));
    },
    facebook_authenticate: (accessToken, refreshToken, profile, cb) => {
        findUserById('facebook', profile.id, (err, user) => (
            cb(err, user)
        ));
    },
    authenticate: (username, password, done) => {
        findUserByName(username, (err, user) => {
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
        findUserById('', id, (err, user) => {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    }
};