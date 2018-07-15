import mongoose from 'mongoose';
import {preSaveLastModifiedDate} from "../helpers/utils";

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
    },
    lastModifiedDate: {
        type: Date
    }
});

User.pre('save', preSaveLastModifiedDate);

module.exports = User;