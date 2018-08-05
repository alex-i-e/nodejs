var util = require('util');

import {deleteItem, getAll, processQuery} from "../helpers/utils";
import mongoose from 'mongoose';

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    deleteProduct
};

async function getProducts(req, res) {
    await getAll({schemeName: 'Product', res});
}

async function getProductById(req, res) {
    const ProductModel = await mongoose.model('Product', require('../models/Product'));

    await processQuery(ProductModel.find({productId: req.swagger.params.productId.value}), res);
}

async function addProduct(req, res) {
    const ProductModel = await mongoose.model('Product', require('../models/Product'));
    const productInstance = new ProductModel();
    const memberWithMaxProductId = await ProductModel
        .findOne({})
        .sort('-productId')
        .exec();

    productInstance.productId = memberWithMaxProductId.productId + 1;
    productInstance.name = req.swagger.params.product.value.name;
    productInstance.brand = req.swagger.params.product.value.brand;
    productInstance.price = req.swagger.params.product.value.price;
    productInstance.options = {
        color: req.swagger.params.product.value.color,
        size: req.swagger.params.product.value.size
    };

    productInstance.save()
        .then(data => processQuery(Promise.resolve(data), res))
        .catch(err => console.log(err));
}

async function deleteProduct(req, res) {
    await deleteItem({
        schemeName: 'Product',
        fieldName: 'productId',
        id: req.swagger.params.productId.value,
        res
    });
}