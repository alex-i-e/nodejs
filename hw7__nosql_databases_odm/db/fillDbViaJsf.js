import {db} from "../config/config.json";
import mongoose from 'mongoose';

const jsf = require('json-schema-faker');
const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
const ProductSchema = require('../models/Product');

mongoose.connect(url, {useNewUrlParser: true});

const CityModel = mongoose.model('City', require('../models/City'));
const UserModel = mongoose.model('User', require('../models/User'));
const ProductModel = mongoose.model('Product', ProductSchema);

const userSchema = {
    "type": "object",
    "properties": {
        "user": {
            "type": "object",
            "properties": {
                "username": {
                    "type": "string",
                    "faker": "name.findName"
                },
                "email": {
                    "type": "string",
                    "format": "email",
                    "faker": "internet.email"
                },
                "password": {
                    "type": "string",
                    "minLength": 8
                },
                "passwordHash": {
                    "type": "string",
                    "pattern": "[a-z0-9]{64}"
                }
            },
            "required": [
                "username",
                "email",
                "password",
                "passwordHash"
            ]
        }
    },
    "required": [
        "user"
    ],
    "definitions": {
        "positiveInt": {
            "type": "integer",
            "minimum": 0,
            "exclusiveMinimum": true
        }
    }
};

jsf.resolve(userSchema).then(function (sample) {
    console.log('JSF USER schema');
    console.log(sample.user);
    // "[object Object]"

    const userInstance = new UserModel();
    console.log(' >>> userInstance=', userInstance);

    userInstance.username = sample.user.username;
    userInstance.email = sample.user.email;
    userInstance.password = sample.user.password;
    userInstance.passwordHash = sample.user.passwordHash;

    userInstance.save(function (err, data) {
        if (!err) console.log('Success!');
        console.log(' >>> user data=', data);
    });


    console.log(sample.user.username);
});

const productSchema = {
    "type": "object",
    "properties": {
        "product": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "pattern": "coat|gloves|shoes|t-shirt|pants|hat"
                },
                "brand": {
                    "type": "string",
                    "pattern": "A|B|GUCCI|NIKE|COOLEST"
                },
                "price": {
                    "type": "string",
                    "pattern": "10|30|50|75|100|120|150|200|300|500"
                },
                "options": {
                    "type": "object",
                    "properties": {
                        "color": {
                            "type": "string",
                            "pattern": "coat|gloves|shoes|t-shirt|pants|hat"
                        },
                        "size": {
                            "type": "string",
                            "pattern": "S|M|L|XL|XXL|XXXL"
                        }
                    },
                    "required": [
                        "color",
                        "size"
                    ]
                }
            },
            "required": [
                // "id",
                "name",
                "brand",
                "price",
                "options"
            ]
        }
    },
    "required": [
        "product"
    ]
};

(async () => {
    try {
        const sample = await jsf.resolve(productSchema);


        if (sample.product) {
            throw new Error('Empty sample');
        }

        console.log('JSF PRODUCT schema');
        console.log(sample.product);

        const productInstance = new ProductModel();
        console.log(' >>> productInstance=', productInstance);

        productInstance.id = sample.product.id;
        productInstance.name = sample.product.name;
        productInstance.brand = sample.product.brand;
        productInstance.price = sample.product.price;
        productInstance.options = {};
        productInstance.options.color = sample.product.options.color;
        productInstance.options.size = sample.product.options.size;

        productInstance.save(function (err, data) {
            if (!err) console.log('Success!');
            console.log(' >>> product data=', data);
        });
    } catch (err) {
        console.log('Error=>', err);
    }
})();