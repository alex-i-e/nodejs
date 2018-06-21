const fs = require('fs');
const through2 = require('through2');
import { toFullPath } from '../http-servers/html-server';

export function isExistPath(filePath) {
	return fs.existsSync(toFullPath(filePath));
}

export function templateParser(template, mapper) {
	for (let prop in mapper) {
		if (mapper.hasOwnProperty(prop)) {
			template = template.replace(`{${prop}}`, mapper[prop]);
		}
	}

	return template;
}

export function applyParser(res, fileName, templateMapper) {
	fs.createReadStream(toFullPath(fileName))
		.pipe(through2(
			function (chunk, enc, cb) {
				this.push(templateParser(new String(chunk), templateMapper));
				cb(null, '\n');
			}, // transform is a noop
			function (cb) { // flush function
				// this.push('tacking on an extra buffer to the end');
				cb();
			},
		))
		.pipe(res);
}