export default class {
    constructor(dirwatcher) {
        this.dirwatcher = dirwatcher;
    }

    // * It should be able to listen to DirWatcher events
    // * and start importing CSV files
    // * (converting the data to JavaScript objects) on ‘dirwatcher:changed’ event.
    // should return a promise with imported data from file at path
    import(path, eventName) {

        const onAsyncImportAction = (a, b) => {
            setImmediate(() => {
                console.log('Importer: this happens Asynchronously');
            });
        };

        console.log('this.dirwatcher=', this.dirwatcher);
        this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onAsyncImportAction);
    }

    // should be synchronous and return all imported data from file at path.
    importSync(path) {

        // set function to avoid emitter leak in the end
        const onSyncImportAction = () => {
            console.log('Importer: this happens Synchronously');
        };

        this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onSyncImportAction);
    }
}