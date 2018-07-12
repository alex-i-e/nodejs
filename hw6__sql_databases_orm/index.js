import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';

const logger = require('morgan');
const express = require('express');
const appServer = require('http').createServer();
const app = express(appServer);
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

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

app.use('/', require('./routes/indexRoute'));
app.use('/api', require('./routes/api'));

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
