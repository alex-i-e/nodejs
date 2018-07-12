const express = require('express');
const router = express.Router();

import verifyToken from '../middlewares/verifyToken';

router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
});
router.get('/products', verifyToken, function getAllProducts(req, res) {
	res.send('Return all products');
});
router.get('/products/:id', verifyToken, function getSpecifiedProduct(req, res) {
	res.send(`Return specific product with id: ${req.params.id}`);
});
router.get('/products/:id/reviews', verifyToken, function getReviewBySpecifiedProduct(req, res) {
	res.send(`Return review from the product with id: ${req.params.id}`);
});
router.post('/products', verifyToken, function addProduct(req, res) {
	res.json(req.body);
});
router.get('/users', verifyToken, function getAllUsers(req, res) {
	res.send('Return all users');
});
router.get('/*', verifyToken, function throwError(req, res, next) {
	next(new Error('API does not exist yet!'));
});

export default router;