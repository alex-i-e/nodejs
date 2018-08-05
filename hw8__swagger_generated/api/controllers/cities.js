var util = require('util');

import {deleteItem, getAll, processQuery} from "../helpers/utils";
import mongoose from 'mongoose';

module.exports = {
    getCities,
    getCityById,
    updateCityById,
    addCity,
    deleteCity
};

async function getCities(req, res) {
    await getAll({schemeName: 'City', res});
}

async function getCityById(req, res) {
    const model = await mongoose.model('City', require('../models/City'));
    await processQuery(model.find({cityId: req.swagger.params.cityId.value}), res);
}

async function updateCityById(req, res) {
    try {
        const model = await mongoose.model('City', require('../models/City'));
        let instance = await model
            .findOne({cityId: req.swagger.params.id.value});

        if (!instance) {
            instance = new model();
        }

        const memberWithMaxId = await model
            .findOne({})
            .sort('-cityId')
            .exec();

        instance.cityId = memberWithMaxId.cityId + 1;
        instance.name = req.swagger.params.name.value || instance.name;
        instance.country = req.swagger.params.country.value || instance.country;
        instance.capital = req.swagger.params.capital.value || instance.capital;
        instance.location = {
            lat: req.swagger.params.lat.value || instance.lat,
            long: req.swagger.params.long.value || instance.long
        };

        instance.save()
            .then(data => processQuery(Promise.resolve(data), res))
            .catch(err => console.log(err));
    } catch (err) {
        console.log(err);
    }
}

async function addCity(req, res) {
    const model = await mongoose.model('City', require('../models/City'));
    const instance = new model();
    const memberWithMaxId = await model
        .findOne({})
        .sort('-cityId')
        .exec();

    instance.cityId = memberWithMaxId.cityId + 1;
    instance.name = req.swagger.params.name.value || instance.name;
    instance.country = req.swagger.params.country.value || instance.country;
    instance.capital = req.swagger.params.capital.value || instance.capital;
    instance.location = {
        lat: req.swagger.params.lat.value || instance.lat,
        long: req.swagger.params.long.value || instance.long
    };

    instance.save()
        .then(data => processQuery(Promise.resolve(data), res))
        .catch(err => console.log(err));
}


async function deleteCity(req, res) {
    await deleteItem({
        schemeName: 'City',
        fieldName: 'cityId',
        id: req.swagger.params.cityId.value,
        res
    });
}