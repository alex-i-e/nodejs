import {capitalize} from "../helpers/utils";
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Counter = mongoose.model('counter', require('./Counter'));
const Product = new Schema({
    productId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        match: /[a-zA-Z]/
    },
    brand: {
        type: String,
        match: /[a-zA-Z]/,
        required: true,
        uppercase: true
    },
    price: {
        type: String,
        default: 'Ask seller, please'
    },
    options: {
        color: {type: String},
        size: {type: String}
    }
});

Product.path('name').set(nameValue => capitalize(nameValue));
Product.pre('save', function (next) {
    console.log(' > pre Save > [Product]');
    const doc = this;
    console.log('DOC =>', doc);

    next();
});

module.exports = Product;