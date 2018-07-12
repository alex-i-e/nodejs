import {development as db} from "../server/config/config.json";

const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const url = `postgres://${db.username}:${db.password}@${db.host}/${db.database}`;

async function processQuery(queryString, res) {
    try {
        const client = new Client(url);
        await client.connect();

        const query = await client.query(queryString);
        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        await client.end();

        res.json({
            status: "OK",
            result: query.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "ERROR",
            code: err.statusCode,
            result: err.message
        });
    }
}

router.get('/products', async function getAllProducts(req, res) {
    await processQuery(`
            SELECT * 
            FROM "Products"
            ORDER BY id ASC 
            `,
        res);
});

router.get('/products/:id', async function getSpecifiedProduct(req, res) {
    await processQuery(`
            SELECT * 
            FROM "Products" as pr
            WHERE pr.id = ${req.params.id}
            ORDER BY id ASC 
            `,
        res);
});

router.get('/products/:id/reviews', function getReviewBySpecifiedProduct(req, res) {
    res.send(`Return review from the product with id: ${req.params.id}`);
});

router.post('/products', async function addProduct(req, res) {
    await processQuery(`
            INSERT INTO "Products" (name, brand, price, options, "createdAt", "updatedAt") VALUES
            (
            '${req.body.name}', 
            '${req.body.brand}', 
            ${req.body.price}, 
            '${req.body.options}', 
            '${new Date().toUTCString()}', 
            '${new Date().toUTCString()}'
            )
            RETURNING *
            `,
        res);
});

router.get('/users', async function getAllUsers(req, res) {
    await processQuery(`
            SELECT * 
            FROM "Users" as pr
            ORDER BY id ASC 
            `,
        res);
});

router.get('/*', function throwError(req, res, next) {
    next(new Error('API does not exist yet!'));
});

module.exports = router;