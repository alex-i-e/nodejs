import DirWatcher from "./dirwatcher/DirWatcher";
import Importer from "./importer/Importer";
const path = require('path');


const http = require('http');
const port = 3000;
const WATCH_DIR = 'data/';
const WATCH_DELAY = 5000;
const DIRWATCH_EVENT_NAME = 'dirwatcher:changed';

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello Node.js Server!');
};
const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  const dirWatcher = new DirWatcher(DIRWATCH_EVENT_NAME);
  dirWatcher.watch(WATCH_DIR, WATCH_DELAY);

  const importer = new Importer(dirWatcher);
  importer.import(path.join(__dirname, WATCH_DIR));
  importer.importSync(path.join(__dirname, WATCH_DIR));

  console.log(`server is listening on ${port}`);
});