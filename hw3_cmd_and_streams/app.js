const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const log = console.log;
const rp = require('request-promise');
const through2 = require('through2');
const csvjson = require('csvjson');

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

const reverseString = (str) => {
  return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}

const reverse = () => {
  process.stdin.pipe(through2(
    function (chunk, enc, cb) { 
      this.push(reverseString(new String(chunk)));
      cb(null, '\n');
    }, // transform is a noop
    function (cb) { // flush function
      this.push('tacking on an extra buffer to the end');
      cb();
    }
  ))
  .pipe(process.stdout);
}

const transform = () => {
  process.stdin.pipe(through2(
    function (chunk, enc, cb) { 
      this.push(new String(chunk).toUpperCase());
      cb(null, '\n');
    }, // transform is a noop
    function (cb) { // flush function
      this.push('tacking on an extra buffer to the end');
      cb();
    }
  ))
  .pipe(process.stdout);
}

const isExistFile = (filePath) =>  {
  return fs.existsSync(filePath);
}

const outputFile = (filePath) => {

  // fs.createReadStream(filePath)
  // .pipe(process.stdout);

  // const readable = getReadableStreamSomehow();
  // const writable = fs.createWriteStream('file.txt');
  // All the data from readable goes into 'file.txt'
  // readable.pipe(writable);
  
  fs.createReadStream(filePath).pipe(process.stdout);
} 

const convertFromFile = (filePath) => {
  const readable = fs.createReadStream(filePath);
  const writable = process.stdout;
  const convertOptions = {
    delimiter: ',',
    quote: '"',
  };
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();
  let csvData = '';

  readable.on('data', (chunk) => {
    csvData += chunk.toString();
  });
  readable.on('end', () => {
    console.log('\nThere will be no more data.');
  });

  readable.pipe(toObject).pipe(stringify).pipe(writable);
}

const convertToFile = (filePath) => {
  const fileOutputPath = filePath.replace('.csv', '.json');
  const readable = fs.createReadStream(filePath);
  const writable = fs.createWriteStream(fileOutputPath);
  const convertOptions = {
    delimiter: ',',
    quote: '"',
  };
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();
  let csvData = '';

  readable.on('data', (chunk) => {
    csvData += chunk.toString();
  });
  readable.on('end', () => {
    console.log('\nThere will be no more data.');
  });

  readable.pipe(toObject).pipe(stringify).pipe(writable);
}

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

    if(argv[firstAttr] === 'outputFile') {
      if (isExistFile(argv[secondAttr]) && argv[secondAttr].endsWith('.csv')) {
        outputFile(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }

    if(argv[firstAttr] === 'convertFromFile') {
      if (isExistFile(argv[secondAttr]) && argv[secondAttr].endsWith('.csv')) {
        convertFromFile(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }

    if(argv[firstAttr] === 'convertToFile') {
      if (isExistFile(argv[secondAttr]) && argv[secondAttr].endsWith('.csv')) {
        convertToFile(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }
    
  } else {
  // DO if ONLY --action IGNORE others
    log('action >>>', argv[firstAttr]);
    log('file >>>', argv[secondAttr]);

    if (argv[firstAttr] === 'reverse') {
      reverse();
    }
    if (argv[firstAttr] === 'transform') {
      transform();
    }
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



// const stream = through(write, end);

// process.stdin.pipe(process.stdout);



// process.stdin.setEncoding('utf8');

// process.stdin.on('readable', () => {
//   const chunk = process.stdin.read();
//   if (chunk !== null) {
//     process.stdout.write(`data: ${chunk}`);
//   }
// });

// process.stdin.on('end', () => {
//   process.stdout.write('end');
// });