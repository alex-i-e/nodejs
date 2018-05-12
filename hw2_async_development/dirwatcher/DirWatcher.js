const EventEmitter = require('events');
const fs = require('fs');

class MyEmitter extends EventEmitter {
}

export default class {
	constructor(eventName) {
		this.path = '.';
		this.delay = 60000;
		this.eventName = eventName;

		this.myEmitter = new MyEmitter();
		this.prevMapFiles = new Map();
		this.newMapFiles = new Map();
		this.mapFiles = new Map();
		this.intervalListeners = new Map();
		this.onDirWatchAction = new Map();
	}

	/**
	 * emit a ‘changed‘ event
	 * if directory contents have been changed
	 * (implement method watch(path, delay) by yourself,
	 * try not to use native fs.watch()).
	 *
	 * When the path is checked for the first time all files should be treated as new.
	 */
	watch(path = '.', delay = 5000) {
		const onDirWatchAction = () => {
			console.log('DirWatcher: an event occurred!');
		};

		this.path = path;
		this.delay = delay;

		this.onDirWatchAction.set(this.getWatcherName(path, delay), onDirWatchAction);
		this.myEmitter.on(this.eventName, onDirWatchAction);

		const readDirCallback = (err, files) => {
			if (err) console.log('Error with [readDirCallback]', err);

			this.prevMapFiles = new Map(this.newMapFiles);
			this.newMapFiles = this.getCsvFilesOnly(files);
			const comparedMap = this.changedFileMap(this.prevMapFiles, this.newMapFiles);

			if (this.newMapFiles.size === 0 || comparedMap.size) {
				console.log('files >>> ', files);


				this.mapFiles = comparedMap;
				this.myEmitter.emit(this.eventName);
			} else {
				console.log('files >>> ', 'the same...');
			}

		};

		try {
			fs.readdir(path || this.path, { encoding: 'utf8' }, readDirCallback);
		} catch (err) {
			console.log('Cannot apply fs.readdir', err);
		}

		const intervalListener = setInterval(() => {
			try {
				fs.readdir(path || this.path, { encoding: 'utf8' }, readDirCallback);
			} catch (err) {
				console.log('Cannot apply fs.readdir', err);
			}
		}, delay);
		this.intervalListeners.set(this.getWatcherName(path, delay), intervalListener);
	}

	getCsvFilesOnly(files = []) {
		const mapFiles = new Map();
		files.forEach(item => {
			// sync STAT
			const stat = fs.statSync(this.path + item);

			if (/\.csv$/.test(item)) {
				mapFiles.set(item, {
					type: 'added',
					fileName: item,
					modifyTime: stat.mtimeMs,
					changeTime: stat.ctimeMs,
				});
			}
		});
		return mapFiles;
	}

	changedFileMap(map1, map2) {
		const comparedMap = new Map();

		for (var [key, value] of map1.entries()) {
			if (!map2.has(key)) {
				comparedMap.set(key, Object.assign(value, { type: 'removed' }));
			}
		}

		for (var [key, value] of map2.entries()) {
			if (!map1.has(key)) {
				comparedMap.set(key, Object.assign(value, { type: 'added' }));
			}

			if (map1.has(key) && map1.get(key).modifyTime < map2.get(key).modifyTime) { // TODO :  changeTime ????
				comparedMap.set(key, Object.assign(value, { type: 'modified' }));
			}
		}

		return comparedMap;
	}

	unwatch(path, delay) {
		this.intervalListeners.has(this.getWatcherName(path, delay))
		&& this.intervalListeners.get(this.getWatcherName(path, delay))();

		this.onDirWatchAction.has(
			this.getWatcherName(path, delay))
		&& this.myEmitter.removeListener(
			this.eventName,
			this.onDirWatchAction.get(this.getWatcherName(path, delay)),
		);
	}

	getWatcherName(path, delay) {
		return `${path || ''}_${delay || ''}`;
	}
}