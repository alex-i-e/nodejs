import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Counter = mongoose.model('counter', require('./Counter'));
const User = new Schema({
    userId: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        match: /[A-Za-z]/
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String
    },
    passwordHash: {
        type: String
    }
});

User.pre('save', function (next) {
    console.log(' > pre Save > [User]');
    const doc = this;

    next();
});

module.exports = User;