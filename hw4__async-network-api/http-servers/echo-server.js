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

		// res.writeHead(200, {
		// 	'Content-Type': 'text/plain',
		// });
		//
		// res.write('PONG...');
		//
		// // Echo-Server
		// req.pipe(res);

		let body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			res.end(body);
		});

	});
// .listen(3300);