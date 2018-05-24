const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const log = console.log;
const rp = require('request-promise');
const through2 = require('through2');
const csvjson = require('csvjson');

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

const BUNDLE_FILE = 'bundle.css';
const EXTERNAL_FILE = 'external.css';
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

const isExistPath = (filePath) => {
  return fs.existsSync(filePath);
}

const outputFile = (filePath) => {
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
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();

  readable.pipe(toObject).pipe(stringify).pipe(writable);
}

const cssBundler = (path) => {

  const readDirCallback = (err, files) => {
    if (err) console.log('Error with [readDirCallback]', err);
    console.log('files >>> ', files);
    
    files = files.map(file => `${path}/${file}`);
    files.push(`${EXTERNAL_FILE}`);

    console.log('files >>> ', files);
    
    processFilesIntoOne(files);
  };

  const processFilesIntoOne = async (files, endFile) => {
    console.log(`${path}/${BUNDLE_FILE}`);

    const writer = fs.createWriteStream(`${path}/${BUNDLE_FILE}`);
    
    for(let i = 0; i< files.length; i++ ) {
      const file = files[i];
      console.log(`>>> ${file}`);

      const readable = fs.createReadStream(file);
      readable.pipe(writer, { end: false });

      console.log(await new Promise(res => {
        readable.on('end', () => {
          res(`done ... ${file}`);
        });
      }));
    }
  }

  if (isExistPath(path)) {
    try {
      fs.readdir(path, {
        encoding: 'utf8'
      }, readDirCallback);
    } catch (err) {
      console.log('Cannot apply fs.readdir', err);
    }
  }
}

const values = Object.keys(argv).slice(1);
const firstAttr = values[0];
const secondAttr = values[1];

if (firstAttr === 'a' || firstAttr === 'action') {
  if (secondAttr === 'f' || secondAttr === 'file') {
    log('action >>>', argv[firstAttr]);
    log('file >>>', argv[secondAttr]);

    if (argv[firstAttr] === 'outputFile') {
      if (isExistPath(argv[secondAttr]) && argv[secondAttr].endsWith('.csv')) {
        outputFile(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }

    if (argv[firstAttr] === 'convertFromFile') {
      if (isExistPath(argv[secondAttr]) && argv[secondAttr].endsWith('.csv')) {
        convertFromFile(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }

    if (argv[firstAttr] === 'convertToFile') {
      if (isExistPath(argv[secondAttr]) && argv[secondAttr].endsWith('.csv')) {
        convertToFile(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }
  } else if (secondAttr === 'p' || secondAttr === 'path')  {
    log('action >>>', argv[firstAttr]);
    log('file >>>', argv[secondAttr]);

    if (argv[firstAttr] === 'cssBundler') {
      if (isExistPath(argv[secondAttr])) {
        cssBundler(argv[secondAttr]);
      } else {
        log(chalk.black.bgRed('wrong input '));
        process.argv.push('-h');
      }
    }
  } else {
    log('action >>>', argv[firstAttr]);
    log('file >>>', argv[secondAttr]);

    if (argv[firstAttr] === 'reverse') {
      reverse();
    }
    if (argv[firstAttr] === 'transform') {
      transform();
    }

    if (~['outputFile', 'convertFromFile', 'convertToFile', 'cssBundler'].indexOf(argv[firstAttr])) {
      log(chalk.black.bgRed('wrong input '));
      process.argv.push('-h');
    }
  }
}

if (process.argv.length < 3) {
  log(chalk.black.bgRed('wrong input '));
  process.argv.push('-h');
}

program
  .version('1.0.0')
  .option('-a, --action <action>', 'choose an <action>')
  .option('-a -f, --action <action> --file <file>', 'choose an <action> and a <file> if needed')
  .option('-a -p, --action <action> --path <path>', 'choose an <action> and a <path>')
  .parse(process.argv); // end with parse to parse through the input