import {db} from "../config/config.json";
import mongoose from 'mongoose';
import {default as cityMock} from '../bin/cities.json';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

const CityModel = mongoose.model('City', require('../models/City'));

for (let i = 0; i < cityMock.length; i++) {
    const sample = cityMock[i];
    const instance = new CityModel();
    console.log(' >>> instance=', instance);
    console.log(' >>> sample=', sample);

    instance.cityId = sample.cityId || i;
    instance.name = sample.name;
    instance.country = sample.country;
    instance.capital = sample.capital;
    instance.location = {
        lat: sample.location.lat,
        long: sample.location.long,
    };

    instance.save()
        .then(data => {
            console.log(' >>> product data=', data);
        })
        .catch(err => console.log(err));
}