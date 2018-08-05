const express = require('express');
const router = express.Router();

import {processQuery, deleteItem, getAll} from "../helpers/utils";
import mongoose from 'mongoose';

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
        const memberWithMaxId = await model
            .findOne({})
            .sort('-cityId')
            .exec();

        if (!instance) {
            instance = new model();
        }

        await makeNewInstance({
            memberWithMaxId,
            instance,
            req,
            res
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/cities', async function addCity(req, res) {
    try {
        const model = mongoose.model('City', require('../models/City'));
        const instance = new model();
        const memberWithMaxId = await model
            .findOne({})
            .sort('-cityId')
            .exec();

        await makeNewInstance({
            memberWithMaxId,
            instance,
            req,
            res
        });
    } catch (err) {
        console.log(err);
    }
});

async function makeNewInstance({
                                   memberWithMaxId,
                                   instance,
                                   req,
                                   res
                               }) {
    instance.cityId = memberWithMaxId.cityId + 1;
    instance.name = req.body.name || instance.name;
    instance.country = req.body.country || instance.country;
    instance.capital = req.body.capital || instance.capital;
    instance.location = {
        lat: req.body.lat || instance.lat,
        long: req.body.long || instance.long
    };

    await instance.save()
        .then(data => processQuery(Promise.resolve(data), res))
        .catch(err => console.log(err));
}

module.exports = router;