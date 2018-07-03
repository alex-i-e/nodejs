import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
// import {db} from "./config/config.json";
import {development as db} from "./server/config/config.json";

const logger = require('morgan');
const express = require('express');
const appServer = require('http').createServer();
const app = express(appServer);
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');


const {Client} = require('pg');
// const dbClient = new Client(`postgres://${db.pg.login}:${db.pg.password}@${db.pg.host}/${db.pg.dbName}`);
const dbClient = new Client(`postgres://${db.username}:${db.password}@${db.host}/${db.database}`);

app.use(logger('dev'));

// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());

app.use(customCookieParser);

app.use(customQueryParser);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

dbClient.connect();

app.use('/', require('./routes/indexRoute'));
app.use('/api', require('./routes/api')(dbClient));

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
