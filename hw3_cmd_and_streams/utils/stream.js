const argv = require('minimist')(process.argv.slice(2));
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const log = console.log;
const rp = require('request-promise');
const through2 = require('through2');
const csvjson = require('csvjson');
const {join, extname, basename} = require('path');

const toFullPath = (...paths) => join(__dirname, ...paths);

log('toFullPath >>> ',toFullPath());

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

function reverseString (str) {
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

function isExistPath(filePath) {
  return fs.existsSync(toFullPath(filePath));
}

const outputFile = (filePath) => {
  log(toFullPath(filePath));
  fs.createReadStream(toFullPath(filePath)).pipe(process.stdout);
}

const convertFromFile = (filePath) => {
  const readable = fs.createReadStream(toFullPath(filePath));
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
    log('\nThere will be no more data.');
  });

  readable.pipe(toObject).pipe(stringify).pipe(writable);
}

const convertToFile = (filePath) => {
  const fileOutputPath = filePath.replace('.csv', '.json');
  const readable = fs.createReadStream(toFullPath(filePath));
  const writable = fs.createWriteStream(toFullPath(fileOutputPath));
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();

  readable.pipe(toObject).pipe(stringify).pipe(writable);
}

const cssBundler = (path) => {
  path = toFullPath(path);
  const readDirCallback = (err, files) => {
    if (err) log('Error with [readDirCallback]', err);
    log('files >>> ', files);
    
    files = files.map(file => `${path}/${file}`);
    files.push(toFullPath(EXTERNAL_FILE));

    log('\nfiles >>> ', files);
    
    processFilesIntoOne(files);
  };

  const processFilesIntoOne = async (files) => {
    log(`\n${path}/${BUNDLE_FILE}`);

    const writer = fs.createWriteStream(`${path}/${BUNDLE_FILE}`);
    
    for(let i = 0; i< files.length; i++ ) {
      const file = files[i];
      log(`>>> ${file}`);

      const readable = fs.createReadStream(file);
      readable.pipe(writer, { end: false });

      log(chalk.green.bgBlack (await new Promise(res => {
        readable.on('end', () => {
          res(`\ndone ... ${file}`);
        });
      })));
    }
  }

  if (fs.existsSync(path)) {
    try {
      fs.readdir(path, {
        encoding: 'utf8'
      }, readDirCallback);
    } catch (err) {
      log('Cannot apply fs.readdir', err);
    }
  }
}

////////////////////////////////////////////////////////// 

for (let key in argv) {
  log(chalk.white(key, ' >>> ', argv[key]));
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
    log('path >>>', argv[secondAttr]);

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
    log('attrs >>>', argv[secondAttr]);

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