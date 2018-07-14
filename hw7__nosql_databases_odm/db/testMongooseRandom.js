import {db} from "../config/config.json";
import mongoose from 'mongoose';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

const CityModel = mongoose.model('City', require('../models/City'));
// const cityInstance = new CityModel();
//
// console.log(' >>> cityInstance=', cityInstance);
//
// cityInstance.capital = true;
// cityInstance.save(function (err, data) {
//     if (!err) console.log('Success!');
//     console.log(' >>> data=', data);
// });

// CityModel.find({}, function (err, docs) {
//     // docs.forEach
//     console.log(' >>> docs=', docs);
// });

CityModel
    .countDocuments()
    .exec(async (err, count) => {
        if (err) {
            throw new Error(err);
        }

        const random = getRandom(count);
        const doc = await CityModel.findOne({}).skip(random);

        console.log('doc=', doc);
    });

function getRandom(maxCount) {
    return Math.floor(Math.random() * maxCount)
}