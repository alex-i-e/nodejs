import {db} from "../config/config.json";
import mongoose from 'mongoose';
import {default as productMock} from '../bin/products.json';
import {default as userMock} from '../bin/users.json';
import {default as cityMock} from '../bin/cities.json';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

const CityModel = mongoose.model('City', require('../models/City'));
const UserModel = mongoose.model('User', require('../models/User'));
const ProductModel = mongoose.model('Product', require('../models/Product'));


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

for (let i = 0; i < userMock.length; i++) {
    const sample = userMock[i];
    const instance = new UserModel();
    console.log(' >>> instance=', instance);
    console.log(' >>> sample=', sample);

    instance.userId = sample.userId || i;
    instance.username = sample.username;
    instance.email = sample.email;
    instance.password = sample.password;
    instance.passwordHash = sample.passwordHash;

    instance.save()
        .then(data => {
            console.log(' >>> product data=', data);
        })
        .catch(err => console.log(err));
}

for (let i = 0; i < productMock.length; i++) {
    const sample = productMock[i];
    const productInstance = new ProductModel();
    console.log(' >>> productInstance=', productInstance);
    console.log(' >>> sample=', sample);

    productInstance.productId = sample.productId || i;
    productInstance.name = sample.name;
    productInstance.brand = sample.brand;
    productInstance.price = sample.price;
    productInstance.options = {
        color: sample.options.color,
        size: sample.options.size
    };


    productInstance.save()
        .then(data => {
            if (!err) console.log('Success!');
            console.log(' >>> product data=', data);
        })
        .catch(err => console.log(err));
}