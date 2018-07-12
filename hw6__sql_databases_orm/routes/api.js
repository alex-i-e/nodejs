import {development as db} from "../server/config/config.json";

const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
// const {Client} = require('pg');
// const url = `postgres://${db.username}:${db.password}@${db.host}/${db.database}`;
const sequelize = new Sequelize(db.database, db.username, db.password, {
    dialect: 'postgres'
});

const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    passwordHash: Sequelize.STRING
});

const Product = sequelize.define('Product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('name', val.toUpperCase());
        }
    },
    brand: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'noname'
    },
    price: Sequelize.STRING,
    options: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'black'
    }
});

// async function processQuery(queryString, res) {
//     try {
//         const client = new Client(url);
//         await client.connect();
//
//         const query = await client.query(queryString);
//         const rowsJson = JSON.stringify(query.rows);
//         console.log('rowsJson >>> ', rowsJson);
//
//         await client.end();
//
//         res.json({
//             status: "OK",
//             result: query.rows
//         });
//     } catch (err) {
//         res.status(500).json({
//             status: "ERROR",
//             code: err.statusCode,
//             result: err.message
//         });
//     }
// }

router.get('/products', async function getAllProducts(req, res) {
    await sequelize.sync()
        .then(() => Product.findAll())
        .then(products => res.json({
            status: "OK",
            result: products
        })).catch(err => {
            res.status(500).json({
                status: "ERROR",
                code: err.statusCode,
                result: err.message
            });
        });
});

router.get('/products/:id', async function getSpecifiedProduct(req, res) {
    await sequelize.sync()
        .then(() => Product.findById(req.params.id))
        .then(product => {
            console.log(product.toJSON());

            res.json({
                status: "OK",
                result: product.toJSON()
            });
        }).catch(err => {
            res.status(500).json({
                status: "ERROR",
                code: err.statusCode,
                result: err.message
            });
        });
    // await processQuery(`
    //         SELECT *
    //         FROM "Products" as pr
    //         WHERE pr.id = ${req.params.id}
    //         ORDER BY id ASC
    //         `,
    //     res);
});

router.get('/products/:id/reviews', function getReviewBySpecifiedProduct(req, res) {
    res.send(`Return review from the product with id: ${req.params.id}`);
});

router.post('/products', async function addProduct(req, res) {
    await sequelize.sync()
        .then(() => Product.create({
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            options: req.body.options
        }))
        .then(product => {
            console.log(product.toJSON());

            res.json({
                status: "OK",
                result: product.toJSON()
            });
        }).catch(err => {
            res.status(500).json({
                status: "ERROR",
                code: err.statusCode,
                result: err.message
            });
        });
    // await processQuery(`
    //         INSERT INTO "Products" (name, brand, price, options, "createdAt", "updatedAt") VALUES
    //         (
    //         '${req.body.name}',
    //         '${req.body.brand}',
    //         ${req.body.price},
    //         '${req.body.options}',
    //         '${new Date().toUTCString()}',
    //         '${new Date().toUTCString()}'
    //         )
    //         RETURNING *
    //         `,
    //     res);
});

router.get('/users', async function getAllUsers(req, res) {
    await sequelize.sync()
        .then(() => User.findAll())
        .then(users => res.json({
            status: "OK",
            result: users
        }))
        .catch(err => {
            res.status(500).json({
                status: "ERROR",
                code: err.statusCode,
                result: err.message
            });
        });
    // await processQuery(`
    //         SELECT *
    //         FROM "Users" as pr
    //         ORDER BY id ASC
    //         `,
    //     res);
});

router.get('/*', function throwError(req, res, next) {
    next(new Error('API does not exist yet!'));
});

module.exports = router;