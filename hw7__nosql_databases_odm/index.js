import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import {db} from "./config/config.json";

const app = require('express')(require('http').createServer());
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const initDatabases = require('./db/initDatabase');

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
const dbClient = {};

let dbs;
(async () => {
    try {
        dbs = await initDatabases(url, db.mongo.options);
    } catch (err) {
        console.log(err);
    }

    console.log("......dbs......", dbs);
    console.log("......initDatabases......");

    const cursor = dbs.collection('cities').find();
    cursor.forEach(
        function (doc) {
            console.log(doc);
        },
        () => {
        });
})();

/*initDatabases(url, db.mongo.options)
    .then(db => {
        console.log("......initDatabases......");

        const cursor = db.collection('cities').find();
        cursor.forEach(
            function (doc) {
                console.log(doc);
            },
            () => {
            });

    })
    .catch(err => {
        console.log(err);
    });*/

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
