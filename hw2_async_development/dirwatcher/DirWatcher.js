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
        this.myEmitter.on(this.eventName, onDirWatchAction);

        const readDirCallback = (err, files) => {
            if (err) throw new Error(err);

            console.log('files >>> ', files);

            this.myEmitter.emit(this.eventName);
        };

        fs.readdir(path || this.path, {encoding: 'utf8'}, readDirCallback);

        const intervalListener = setInterval(() => {
            fs.readdir(path || this.path, {encoding: 'utf8'}, readDirCallback);
        }, delay);
        this.intervalListeners.set(this.getIntervalName(path, delay), intervalListener);
    }

    unwatch(path, delay) {
        this.intervalListeners.has(this.getIntervalName(path, delay))
        && this.intervalListeners.get(this.getIntervalName(path, delay))();

        this.myEmitter.removeListener(eventName, listener)
    }

    getIntervalName(path, delay) {
        return `${path || ''}_${delay || ''}`;
    }
}