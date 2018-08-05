import {capitalize, preSaveLastModifiedDate} from "../helpers/utils";
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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
    },
    lastModifiedDate: {
        type: Date
    }
});

Product.path('name').set(nameValue => capitalize(nameValue));
Product.pre('save', preSaveLastModifiedDate);

module.exports = Product;