const urlParser = require('url');
const querystring = require('querystring');

const fs = require('fs');

const { request } = require('http');

const product = {
	id: 1,
	name: 'Supreme T-Shirt',
	brand: 'Supreme',
	price: 99.99,
	options: [
		{ color: 'blue' },
		{ size: 'XL' },
	],
};

export default require('http')
	.createServer()
	.on('request', (req, res) => {
		const query = urlParser.parse(req.url).query;
		console.log('query >>>', query);

		const params = querystring.parse(query);
		console.log('params >>>', params);

		const { url, method } = req;
		console.log('<url> [method] >>>', `<${url}> [${method}]`);

		res.writeHead(200, {
			'Content-Type': 'application/json',
		});

		res.end(JSON.stringify(product));
	})
	.listen(3002);