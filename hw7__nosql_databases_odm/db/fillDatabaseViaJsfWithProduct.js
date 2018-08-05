import {db} from "../config/config.json";
import mongoose from 'mongoose';

const jsf = require('json-schema-faker');
const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;

mongoose.connect(url, {useNewUrlParser: true});

const ProductModel = mongoose.model('Product', require('../models/Product'));
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