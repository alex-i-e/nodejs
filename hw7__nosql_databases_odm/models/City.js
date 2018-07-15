import mongoose from 'mongoose';
import {capitalize} from "../helpers/utils";

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const Counter = mongoose.model('counter', require('./Counter'));
const City = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Minsk',
        match: /[a-z]/,
        uppercase: true
    },
    country: {
        type: String,
        default: 'Belarus',
        match: /[a-z]/
    },
    capital: {
        type: Boolean,
        default: true
    },
    location: {
        lat: {type: Number},
        long: {type: Number}
    }
});

City.path('country').set(countryName => capitalize(countryName));
City.pre('save', function (next) {
    console.log(' > pre Save > [city]');
    const doc = this;

    next();
});

module.exports = City;

