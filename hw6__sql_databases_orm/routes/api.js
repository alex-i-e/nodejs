const express = require('express');
const router = express.Router();

module.exports = function processApiRoutes(dbClient) {

    (async () => {
        await dbClient.connect();

        const res = await dbClient.query('SELECT $1::text as message', ['Hello world!']);
        const query = await dbClient.query(`
    SELECT * 
    FROM "Users"
    ORDER BY id ASC 
    `);
        const rowsJson = JSON.stringify(query.rows);
        console.log('rowsJson >>> ', rowsJson);

        console.log(res.rows[0].message); // Hello world!
        await dbClient.end();
    })();

    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });

    router.get('/products', function getAllProducts(req, res) {
        res.send('Return all products');
    });
    router.get('/products/:id', function getSpecifiedProduct(req, res) {
        res.send(`Return specific product with id: ${req.params.id}`);
    });
    router.get('/products/:id/reviews', function getReviewBySpecifiedProduct(req, res) {
        res.send(`Return review from the product with id: ${req.params.id}`);
    });
    router.post('/products', function addProduct(req, res) {
        res.json(req.body);
    });
    router.get('/users', function getAllUsers(req, res) {
        res.send('Return all users');
    });
    router.get('/*', function throwError(req, res, next) {
        next(new Error('API does not exist yet!'));
    });

    return router;
};