import indexRoute from './routes/indexRoute';
import api from './routes/api';
import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import {db} from "./config/config.json";

const logger = require('morgan');
const express = require('express');
const appServer = require('http').createServer();
const app = express(appServer);
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');


const {Client} = require('pg');
const client = new Client(`postgres://${db.pg.login}:${db.pg.password}@${db.pg.host}/${db.pg.dbName}`);

// const Pg = require('pg').Client;
// const conString = "postgres://postgres:pg1234567890@domain.com/nodejs";


(async () => {

    // const pg = new Pg(conString);
    // pg.connect();
    //
    // const query = pg.query("select * from nodejs.users order by id", function (err, result) {
    //     console.log(' >>>. ');
    //
    //     const json = JSON.stringify(result.rows);
    //     console.log(json);
    // });


    await client.connect();

    const res = await client.query('SELECT $1::text as message', ['Hello world!']);

    console.log(res.rows[0].message); // Hello world!
    await client.end();
})();


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

app.use('/', indexRoute);
app.use('/api', api);

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
