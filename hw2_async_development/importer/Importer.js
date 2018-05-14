const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');

export default class {
	constructor(dirwatcher) {
		this.dirwatcher = dirwatcher;

		this.convertOptions = {
			delimiter: ',',
			quote: '"',
		};
		this.encodingConfig = { encoding: 'utf8' };
	}

	import(dataPath) {
		let readFilePromises = [];

		const asyncForEach = (item) => {
			if (fs.existsSync(dataPath + item.fileName)) {
				readFilePromises.push(
					new Promise((res, rej) => {
						fs.readFile(
							dataPath + item.fileName,
							this.encodingConfig,
							(err, data) => {
								if (err) {
									rej(err);// File Reading Error
								}

								try {
									res({ data, item });
								} catch (wrapErr) {
									rej(wrapErr); // Data Processing Error: if needed
								}
							},
						);
					}),
				);
			} else {
				this.log('ASYNC', ' - ', item);
			}
		};

		const onAsyncImportAction = async () => {
			console.log('Importer: this happens Asynchronously...');

			readFilePromises.length = 0;
			this.dirwatcher.mapFiles.forEach(asyncForEach);

			try {
				const dataArr = await Promise.all(readFilePromises);

				dataArr.forEach(file => {
					this.log('ASYNC', file.data, file.item);
				});
			} catch (err) {
				console.log('Cannot receive async data', err);
			}
		};

		this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onAsyncImportAction);
	}

	// should be synchronous and return all imported data from file at path.
	importSync(dataPath) {
		const onSyncImportAction = () => {
			console.log('Importer: this happens Synchronously...');

			this.dirwatcher.mapFiles.forEach(item => {
				if (fs.existsSync(dataPath + item.fileName)) {
					const data = fs.readFileSync(dataPath + item.fileName, this.encodingConfig);

					this.log('SYNC', data, item);
				} else {
					this.log('SYNC', ' - ', item);
				}
			});
		};

		this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onSyncImportAction);
	}

	unwatch(path, delay) {
		this.dirwatcher && this.dirwatcher.unwatch(path, delay);
	}

	log(prefix, data, item) {
		console.log(`[${prefix}] ${item.fileName} [${item.type}] >>>`, csvjson.toObject(data, this.convertOptions));
	}
}