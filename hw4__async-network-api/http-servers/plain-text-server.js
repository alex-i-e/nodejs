const urlParser = require('url');
const querystring = require('querystring');

const fs = require('fs');

const { request } = require('http');

export default require('http')
	.createServer()
	.on('request', (req, res) => {
		const query = urlParser.parse(req.url).query;
		console.log('query >>>', query);

		const params = querystring.parse(query);
		console.log('params >>>', params);

		const { url, method } = req;
		console.log('<url> [method] >>>', `<${url}> [${method}]`);

		// Plain-Text-Server
		res.writeHead(200, {
			'Content-Type': 'text/plain',
		});
		res.end('Hello World');

	})
	.listen(3000);