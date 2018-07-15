const express = require('express');
const router = express.Router();

import {db} from "../config/config.json";
import mongoose from 'mongoose';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

async function processQuery(action, res) {
    try {
        const result = await action;

        res.json({
            status: "OK",
            result
        });
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.stack
        });
    }
}

router.get('/products', async function getAllProducts(req, res) {
    const ProductModel = mongoose.model('Product', require('../models/Product'));
    await processQuery(ProductModel.find({}), res);
});

router.get('/products/:id', async function getSpecifiedProduct(req, res) {
    const ProductModel = mongoose.model('Product', require('../models/Product'));
    await processQuery(ProductModel.find({productId: req.params.id}), res);
});

router.get('/products/:id/reviews', function getReviewBySpecifiedProduct(req, res) {
    res.send(`Return review from the product with id: ${req.params.id}`);
});

router.post('/products', async function addProduct(req, res) {
    const ProductModel = mongoose.model('Product', require('../models/Product'));
    const productInstance = new ProductModel();
    const memberWithMaxProductId = await ProductModel
        .findOne({})
        .sort('-productId')
        .exec();

    productInstance.productId = memberWithMaxProductId.productId + 1;
    productInstance.name = req.body.name;
    productInstance.brand = req.body.brand;
    productInstance.price = req.body.price;
    productInstance.options = {
        color: req.body.color,
        size: req.body.size
    };

    productInstance.save()
        .then(data => processQuery(Promise.resolve(data), res))
        .catch(err => console.log(err));
});

router.get('/users', async function getAllUsers(req, res) {
    const UserModel = mongoose.model('User', require('../models/User'));
    await processQuery(UserModel.find({}), res);
});

router.get('/*', function throwError(req, res, next) {
    next(new Error('API does not exist yet!'));
});

module.exports = router;