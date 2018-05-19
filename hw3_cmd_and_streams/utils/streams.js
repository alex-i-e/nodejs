


// Main actions to be called

function reverse(str) { /* ... */ }
function transform(str) { /* ... */ }
function outputFile(filePath) { /* ... */ }
function convertFromFile(filePath) { /* ... */ }
function convertToFile(filePath) { /* ... */ }

// === Terminal ===

// ./streams.js --action=outputFile --file=users.csv 
// ./streams.js --action=transformToFile --file=users.csv
// ./streams.js --action=transform textToTransform
// ./streams.js -a outputFile -f users.csv
// ./streams.js --help
// ./streams.js -h
