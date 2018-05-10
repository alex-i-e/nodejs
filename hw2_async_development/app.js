// import "babel-register";
import DirWatcher from "./dirwatcher/DirWatcher";
import Importer from "./importer/Importer";


const http = require('http');
const port = 3000;
const WATCH_DIR = './data';
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
    console.log(`server is listening on ${port}`);

    // Import all of the above modules.
    // Create a Dirwatcher and Importer for processing files asynchronously from data directory.
    // Log imported data to console.
    const dirWatcher = new DirWatcher(DIRWATCH_EVENT_NAME);
    dirWatcher.watch(WATCH_DIR, WATCH_DELAY);

    const importer = new Importer(dirWatcher);
    importer.import(WATCH_DIR);

    console.log('123');
});