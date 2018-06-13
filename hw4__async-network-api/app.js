import appServer from './http-servers/echo-server';
// import  appServer from './http-servers/json-server';
// import  appServer from './http-servers/html-server';
// import  appServer from './http-servers/plain-text-server';

export default appServer;

// const path = require('path');
// const http = require('http');
// const port = 3000;

// const requestHandler = (request, response) => {
//   console.log(request.url);
//   response.end('Hello Node.js Server!');
// };
// const server = http.createServer(requestHandler);
//
// server.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err);
//   }
//
//   console.log(`server is listening on ${port}`);
// });