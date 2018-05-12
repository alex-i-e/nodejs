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

	// * It should be able to listen to DirWatcher events
	// * and start importing CSV files
	// * (converting the data to JavaScript objects) on ‘dirwatcher:changed’ event.
	// should return a promise with imported data from file at path
	import(dataPath) {
		let readFilePromises = [];
		let readFilePromisesObj = {};

		const asyncForEach = (item) => {
			readFilePromises.push(
				new Promise((res, rej) => {
					fs.readFile(
						dataPath + item,
						this.encodingConfig,
						(err, data) => {
							if (err) {
								rej(err);// File Reading Error
							}

							try {
								res(csvjson.toObject(data, this.convertOptions));
							} catch (wrapErr) {
								rej(wrapErr); // Data Processing Error: if needed
							}
						},
					)
				})
			);
		};

		const onAsyncImportAction = async () => {
			console.log('Importer: this happens Asynchronously...');

			readFilePromises.length = 0;
			this.dirwatcher.mapFiles.forEach(asyncForEach);

			try {
				console.log('Async data>>>', await Promise.all(readFilePromises));
			} catch (err) {
				throw new Error(err);
			}
		};

		this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onAsyncImportAction);
	}

	// should be synchronous and return all imported data from file at path.
	importSync(dataPath) {
		const onSyncImportAction = () => {
			console.log('Importer: this happens Synchronously...');

			this.dirwatcher.mapFiles.forEach(item => {
				const data = fs.readFileSync(dataPath + item, this.encodingConfig);

				console.log(csvjson.toObject(data, this.convertOptions));
			});
		};

		this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onSyncImportAction);
	}

	unwatch(path, delay) {
		this.dirwatcher && this.dirwatcher.unwatch(path, delay);
	}
}