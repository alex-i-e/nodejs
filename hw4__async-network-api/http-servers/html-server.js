const urlParser = require('url');
const querystring = require('querystring');

const fs = require('fs');

const { request, get } = require('http');

export default require('http')
	.createServer()
	.on('request', (req, res) => {
		const query = urlParser.parse(req.url).query;
		console.log('query >>>', query);

		const params = querystring.parse(query);
		console.log('params >>>', params);

		const { url, method } = req;
		console.log('<url> [method] >>>', `<${url}> [${method}]`);


		// #2 Echo-Server
		// req.pipe(res);

		if (req.url === '/node/item?query=123&count=1000') {
			// #1 Html-Server
			res.writeHead(200, {
				'Content-Type': 'text/html',
			});

			res.end(`<h1>Hello World on NodeJS</h1>`);
			// or
			// res.write('');
			// res.end();

		} else if (req.url === '/error') {
			// // #4 Plain-Text-Server
			// res.writeHead(404, {
			// 	'Content-Type': 'text/plain',
			// });
			// res.end('Page not found, sorry!');

			// #5 Write some data into file using POST
			const options = {
				hostname: 'localhost',
				port: 3000,
				path: '/hello-world',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const req = request(
				options,
				(res) => {
					res.pipe(fs.createWriteStream('response_data.txt'));
				});

			req.on('error', (err) => {
				console.log(err);
			});

			req.write(JSON.stringify({ some: 'data' }));
			req.end();

		} else if (req.url === '/hello-world') {


		} else {
			// #3 Static-Page-Server
			fs.createReadStream('index.html').pipe(res);
		}

	})
	.listen(3000);