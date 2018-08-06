import mongoose from 'mongoose';
import {capitalize, preSaveLastModifiedDate} from "../helpers/utils";

const Schema = mongoose.Schema;
const City = new Schema({
    cityId: {
        type: Number,
        required: true,
        default: 0,
    },
    name: {
        type: String,
        required: true,
        default: 'Minsk',
        match: /[a-zA-Z]/,
        uppercase: true
    },
    country: {
        type: String,
        default: 'Belarus',
        match: /[a-zA-Z]/
    },
    capital: {
        type: Boolean,
        default: true
    },
    location: {
        lat: {type: Number},
        long: {type: Number}
    },
    lastModifiedDate: {
        type: Date
    }
});

City.path('country').set(countryName => capitalize(countryName));
City.pre('save', preSaveLastModifiedDate);

module.exports = City;

