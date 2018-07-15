const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

import {db} from "../config/config.json";
import mongoose from 'mongoose';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

function lastModifiedDate() {

}

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

async function deleteItem({schemeName, modelName = '', id, fieldName, res}) {
    try {
        const model = mongoose.model(
            modelName || schemeName,
            require(`../models/${schemeName}`)
        );
        const instance = await model.findOne({[fieldName]: id});

        if (instance) {
            instance.remove();
            processQuery(Promise.resolve('DELETED'), res)
        } else {
            res.json({
                status: "INFO",
                result: `${(modelName || schemeName).toUpperCase()} DOES NOT EXIST`
            });
        }
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.stack
        });
    }
}

async function getAll({schemeName, modelName, res}) {
    try {
        const model = mongoose.model(
            modelName || schemeName,
            require(`../models/${schemeName}`)
        );

        await processQuery(model.find({}), res);
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.stack
        });
    }
}

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

    productInstance.save()
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

router.get('/users', async function getAllUsers(req, res) {
    await getAll({schemeName: 'User', res});
});

router.delete('/users/:id', async function deleteUserById(req, res) {
    await deleteItem({
        schemeName: 'User',
        fieldName: 'userId',
        id: req.params.id,
        res
    });
});

router.get('/cities', async function getAllCities(req, res) {
    await getAll({schemeName: 'City', res});
});

router.get('/cities/:id', async function getSpecifiedCity(req, res) {
    const model = mongoose.model('City', require('../models/City'));
    await processQuery(model.find({cityId: req.params.id}), res);
});

router.delete('/cities/:id', async function deleteCityById(req, res) {
    await deleteItem({
        schemeName: 'City',
        fieldName: 'cityId',
        id: req.params.id,
        res
    });
});

router.put('/cities/:id', async function updateCity(req, res) {
    try {
        const model = mongoose.model('City', require('../models/City'));
        let instance = await model
            .findOne({cityId: req.params.id});

        if (!instance) {
            instance = new model();
        }

        const memberWithMaxId = await model
            .findOne({})
            .sort('-cityId')
            .exec();

        instance.cityId = memberWithMaxId.cityId + 1;
        instance.name = req.body.name || instance.name;
        instance.country = req.body.country || instance.country;
        instance.capital = req.body.capital || instance.capital;
        instance.location = {
            lat: req.body.lat || instance.lat,
            long: req.body.long || instance.long
        };

        instance.save()
            .then(data => processQuery(Promise.resolve(data), res))
            .catch(err => console.log(err));
    } catch (err) {
        console.log(err);
    }
});

router.post('/cities', async function addCity(req, res) {
    const model = mongoose.model('City', require('../models/City'));
    const instance = new model();
    const memberWithMaxId = await model
        .findOne({})
        .sort('-cityId')
        .exec();

    instance.cityId = memberWithMaxId.cityId + 1;
    instance.name = req.body.name || instance.name;
    instance.country = req.body.country || instance.country;
    instance.capital = req.body.capital || instance.capital;
    instance.location = {
        lat: req.body.lat || instance.lat,
        long: req.body.long || instance.long
    };

    instance.save()
        .then(data => processQuery(Promise.resolve(data), res))
        .catch(err => console.log(err));
});

router.get('/*', function throwError(req, res, next) {
    next(new Error('API does not exist yet!'));
});

module.exports = router;