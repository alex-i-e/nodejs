const express = require('express');
const router = express.Router();

import {processQuery, deleteItem, getAll} from "../helpers/utils";
import mongoose from 'mongoose';

router.get('/products', async function getAllProducts(req, res) {
    await getAll({schemeName: 'Product', res});
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

    await productInstance.save()
        .then(data => processQuery(Promise.resolve(data), res))
        .catch(err => console.log(err));
});

router.delete('/products/:id', async function deleteProductById(req, res) {
    await deleteItem({
        schemeName: 'Product',
        fieldName: 'productId',
        id: req.params.id,
        res
    });
});

module.exports = router;