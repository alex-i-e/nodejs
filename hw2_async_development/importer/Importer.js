const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');

export default class {
  constructor(dirwatcher) {
    this.dirwatcher = dirwatcher;
  }

  // * It should be able to listen to DirWatcher events
  // * and start importing CSV files
  // * (converting the data to JavaScript objects) on ‘dirwatcher:changed’ event.
  // should return a promise with imported data from file at path
  import(dataPath) {

    const onAsyncImportAction = (a, b) => {
      setImmediate(() => {
        console.log('Importer: this happens Asynchronously...');
      });
    };

    console.log('this.dirwatcher=', this.dirwatcher);
    this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onAsyncImportAction);
  }

  // should be synchronous and return all imported data from file at path.
  importSync(dataPath) {

    // set function to avoid emitter leak in the end
    const onSyncImportAction = () => {
      console.log('Importer: this happens Synchronously...');

      this.dirwatcher.files.forEach(item => {
        const data = fs.readFileSync(dataPath + item, { encoding: 'utf8' });
        const options = {
          delimiter: ',',
          quote: '"'
        };

        console.log(csvjson.toObject(data, options));
      });
    };

    this.dirwatcher.myEmitter.on(this.dirwatcher.eventName, onSyncImportAction);
  }
}