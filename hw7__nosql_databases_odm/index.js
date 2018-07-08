import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import {db} from "./config/config.json";

const app = require('express')(require('http').createServer());
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const initDatabases = require('./db/initDatabase');

// Connection URL
// const url = 'mongodb://localhost:27017';
const url = 'mongodb://localhost:27017/mongodb';
// Database Name
const dbName = 'mongodb';

const option = {
    db: {
        numberOfRetries: 5
    },
    server: {
        auto_reconnect: true,
        poolSize: 40,
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    useNewUrlParser: true
};
// const dbConfig = db;
const dbClient = {};

const assert = require('assert');
//
// let initDb;
// (async () => {
//     initDb = await initDatabases(url, dbName, option);
//
//
//     initDb.then(dbs => {
//
//
//         // assert.equal(null, err);
//         console.log("......initDatabases......");
//
//         const db = dbs;
//         console.log('db.collection(\'cities\') >>>', db.collection('cities'));
//
//         const cursor = db.collection('cities').find();
//         cursor.forEach(
//             function (doc) {
//                 console.log(doc);
//             },
//             () => {
//             });
//
//         // client.close();
//     });
// })();

//
// (async () => {
//     await initDatabases(url, dbName, option)
//         .then(dbs => {
//
//
//             // assert.equal(null, err);
//             console.log("......initDatabases......");
//
//             const db = dbs;
//             console.log('db.collection(\'cities\') >>>', db.collection('cities'));
//
//             const cursor = db.collection('cities').find();
//             cursor.forEach(
//                 function (doc) {
//                     console.log(doc);
//                 },
//                 () => {
//                 });
//
//             // client.close();
//         });
// })();

initDatabases(url, dbName, option)
    .then(dbs => {


        // assert.equal(null, err);
        console.log("......initDatabases......");

        const db = dbs;
        console.log('db.collection(\'cities\') >>>', db.collection('cities'));

        const cursor = db.collection('cities').find();
        cursor.forEach(
            function (doc) {
                console.log(doc);
            },
            () => {
            });

        client.close();
    });


/*
// Use connect method to connect to the server
MongoClient.connect(url, option, async function (err, client) {
    assert.equal(null, err);
    console.log("......Connected successfully to server.......");

    const db = client.db(dbName);
    console.log('db.collection(\'cities\') >>>', db.collection('cities'));

    const cursor = db.collection('cities').find();
    cursor.forEach(
        function (doc) {
            console.log(doc);
        },
        () => {
        });

    client.close();
});
*/


/////////////////////////////////////////

app.use(require('morgan')('dev'));

// need cookieParser middleware before we can do anything with cookies
app.use(require('cookie-parser')());

app.use(customCookieParser);

app.use(customQueryParser);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

app.use('/', require('./routes/indexRoute'));
app.use('/api', require('./routes/api')(dbClient));

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
