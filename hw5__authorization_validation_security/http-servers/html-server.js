const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');

import { applyParser, isExistPath } from '../helpers/template';
const { request } = require('http');
import { INDEX_FILE_NAME, TEMPLATE_MAPPER } from '../config/template.json';

export const toFullPath = (...paths) => join(__dirname, ...paths);

export default require('http')
	.createServer()
	.on('request', (req, res) => {
		// Html-Server
		if (isExistPath(INDEX_FILE_NAME)) {
			res.writeHead(200, {
				'Content-Type': 'text/html',
			});

			applyParser(res, INDEX_FILE_NAME, TEMPLATE_MAPPER);
		} else {
			res.writeHead(200, {
				'Content-Type': 'text/plain',
			});
			res.end('error: file not exist!');
		}
	})
	.listen(3001);