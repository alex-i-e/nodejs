const express = require('express');
const router = express.Router();

module.exports = function processApiRoutes(dbClient) {
    router.get('/products', async function getAllProducts(req, res) {

        const query = await
            dbClient.query(`
    SELECT * 
    FROM "Products"
    ORDER BY id ASC 
    `);


        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        res.json({
            status: "OK",
            result: query.rows
        });
    });
    router.get('/products/:id', async function getSpecifiedProduct(req, res) {

        const query = await
            dbClient.query(`
    SELECT * 
    FROM "Products" as pr
    WHERE pr.id = ${req.params.id}
    ORDER BY id ASC 
    `);

        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        res.json({
            status: "OK",
            result: query.rows
        });
    });
    router.get('/products/:id/reviews', function getReviewBySpecifiedProduct(req, res) {
        res.send(`Return review from the product with id: ${req.params.id}`);
    });
    router.post('/products', async function addProduct(req, res) {

        const query = await dbClient.query(`
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
        `);


        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        res.json({
            status: "OK",
            result: query.rows
        });
    });
    router.get('/users', async function getAllUsers(req, res) {

        const query = await dbClient.query(`
    SELECT * 
    FROM "Users" as pr
    ORDER BY id ASC 
    `);

        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        res.json({
            status: "OK",
            result: query.rows
        });
    });
    router.get('/*', function throwError(req, res, next) {
        next(new Error('API does not exist yet!'));
    });

    return router;
};