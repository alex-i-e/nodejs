import {db} from "../config/config.json";
import mongoose from 'mongoose';
import {default as productMock} from '../bin/products.json';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

const ProductModel = mongoose.model('Product', require('../models/Product'));

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