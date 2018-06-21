const express = require('express');
const router = express.Router();

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

export default router;