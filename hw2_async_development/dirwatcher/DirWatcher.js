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
        this.files = new Map();
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
    watch(path, delay) {
        const onDirWatchAction = () => {
            console.log('DirWatcher: an event occurred!');
        };
        this.onDirWatchAction.set(this.getWatcherName(path, delay), onDirWatchAction);
        this.myEmitter.on(this.eventName, onDirWatchAction);

        const readDirCallback = (err, files) => {
            if (err) throw new Error(err);

            let mapFiles = new Map();
            files.forEach(item => {
                mapFiles.set(item, item);
            });
            if (this.files.size === 0 || !this.isMapSame(this.files, mapFiles)) {
                console.log('files >>> ', files);

                files.forEach(item => {
                    this.files.set(item, item);
                });

                this.myEmitter.emit(this.eventName);
            } else {
                console.log('files >>> ', 'the same...');
            }

        };

        fs.readdir(path || this.path, {encoding: 'utf8'}, readDirCallback);

        const intervalListener = setInterval(() => {
            fs.readdir(path || this.path, {encoding: 'utf8'}, readDirCallback);
        }, delay);
        this.intervalListeners.set(this.getWatcherName(path, delay), intervalListener);
    }

    isMapSame(map1, map2) {
        if (map1 && map2 && map1.size !== map2.size) {
            return false;
        }

        let isSame = true;

        for (var [key, value] of map1) {
            if (!map2.has(key)) {
                isSame = false;
            }
        }
        for (var [key, value] of map2) {
            if (!map1.has(key)) {
                isSame = false;
            }
        }

        return isSame;
    }

    unwatch(path, delay) {
        this.intervalListeners.has(this.getWatcherName(path, delay))
        && this.intervalListeners.get(this.getWatcherName(path, delay))();

        this.onDirWatchAction.has(this.getWatcherName(path, delay))
        && this.myEmitter.removeListener(
            this.eventName,
            this.onDirWatchAction.get(this.getWatcherName(path, delay))
        );
    }

    getWatcherName(path, delay) {
        return `${path || ''}_${delay || ''}`;
    }
}