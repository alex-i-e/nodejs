const argv = require('minimist')(process.argv.slice(2));
const program = require('commander');

const path = require('path');

const chalk = require('chalk');
const log = console.log;

const rp = require('request-promise');

console.dir('==============');
console.dir(argv);
console.dir('==============');

log(chalk.blue(JSON.stringify(argv)))

for (let key in argv) {
  log(chalk.white(key, ' >>> ', argv[key]));
}

/* 'http://www.google.com' */ 
rp('https://epa.ms/nodejs18-hw3-css') 
    .then(function (htmlString) {
        // Process html...

        // using  require('cheerio'); // Basically jQuery for node.js
        // OR require('jsdom')
        // TODO: take from <pre class="drive-viewer-text-page">
        // var d = document.querySelector('.drive-viewer-text-page')
        // d.innerText OR d.innerHTML

        // log(htmlString);
    })
    .catch(function (err) {
        // Crawling failed...
    });

const values = Object.keys(argv).slice(1);
const firstAttr = values[0];
const secondAttr = values[1];

if (firstAttr === 'h' || firstAttr === 'help') {
  log(`'-a, --action [action]', 'choose the <action>'
  '-a, --action [optional]', 'action and [optional] file input'
  '-a, --action [optional]', 'action and [optional] file input'`)
}

if (firstAttr === 'a' || firstAttr === 'action') {
  if (secondAttr === 'f' || secondAttr === 'file') {
    // DO if --action and --file and IGNORE others
    // argv[values[0]]
    // argv[values[1]]

    log('action >>>', argv[firstAttr]);
    log('file >>>', argv[secondAttr]);

  } else {
  // DO if ONLY --action IGNORE others
    log('action >>>', argv[firstAttr]);
    log('file >>>', argv[secondAttr]);
  }
}

if (process.argv.length < 3) {
  log(chalk.black.bgRed('wrong input '));
  process.argv.push('-h');
}

program
  .version('1.0.0')
  .option('-a, --action [action]', 'choose an <action>')
  .option('-a -f, --action <action> --file <file>', 'choose an <action> and a <file> if needed')
  .parse(process.argv); // end with parse to parse through the input


// const http = require('http');
// const port = 3000;

// const requestHandler = (request, response) => {
//   console.log(request.url);
//   response.end('Hello Node.js Server!');
// };
// const server = http.createServer(requestHandler);

// server.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err);
//   }


//   console.log(`server is listening on ${port}`);
// });