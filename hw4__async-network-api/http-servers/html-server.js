const urlParser = require('url');
const querystring = require('querystring');

const chalk = require('chalk');
const fs = require('fs');
const log = console.log;

const through2 = require('through2');
const { request } = require('http');

const { join } = require('path');

const toFullPath = (...paths) => join(__dirname, ...paths);
log('toFullPath >>> ', toFullPath());

const INDEX_FILE_NAME = 'index.html';
const TEMPLATE_MAPPER = { message: 'WOW!' };

function isExistPath(filePath) {
	return fs.existsSync(toFullPath(filePath));
}

function templateParser(template, mapper) {
	for (let prop in mapper) {
		if (mapper.hasOwnProperty(prop)) {
			template = template.replace(`{${prop}}`, mapper[prop]);
		}
	}

	return template;
}

export default require('http')
	.createServer()
	.on('request', (req, res) => {
		const query = urlParser.parse(req.url).query;
		log('query >>>', query);

		const params = querystring.parse(query);
		log('params >>>', params);

		const { url, method } = req;
		log('<url> [method] >>>', `<${url}> [${method}]`);

		// Html-Server
		if (isExistPath(INDEX_FILE_NAME)) {
			res.writeHead(200, {
				'Content-Type': 'text/html',
			});

			fs.createReadStream(toFullPath(INDEX_FILE_NAME))
				.pipe(through2(
					function (chunk, enc, cb) {
						this.push(templateParser(new String(chunk), TEMPLATE_MAPPER));
						cb(null, '\n');
					}, // transform is a noop
					function (cb) { // flush function
						// this.push('tacking on an extra buffer to the end');
						cb();
					},
				))
				.pipe(res);
		} else {
			res.writeHead(200, {
				'Content-Type': 'text/plain',
			});
			res.end('error: file not exist!');
		}
	})
	.listen(3100);