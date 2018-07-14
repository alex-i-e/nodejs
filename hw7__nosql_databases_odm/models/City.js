import mongoose from 'mongoose';

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
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
        default: true},
    location: {
        lat: {type: Number},
        long: {type: Number}
    }
});

City.path('country').set(countryName => capitalize(countryName));
City.pre('save', function (next) {
    // notify(this.get('email'));
    console.log(' > pre Save > [city]');
    next();
});

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = City;

