const express = require('express');
const router = express.Router();

async function processQuery(dbClient, queryString, res) {
    try {
        const query = await dbClient.query(queryString);

        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        res.json({
            status: "OK",
            result: query.rows
        });
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.message
        });
    }
}

module.exports = function processApiRoutes(dbClient) {
    router.get('/products', async function getAllProducts(req, res) {
        await processQuery(
            dbClient, `
            SELECT * 
            FROM "Products"
            ORDER BY id ASC 
            `,
            res);
    });

    router.get('/products/:id', async function getSpecifiedProduct(req, res) {
        await processQuery(
            dbClient, `
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
        await processQuery(
            dbClient, `
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
        await processQuery(
            dbClient, `
            SELECT * 
            FROM "Users" as pr
            ORDER BY id ASC 
            `,
            res);
    });

    router.get('/*', function throwError(req, res, next) {
        next(new Error('API does not exist yet!'));
    });

    return router;
};