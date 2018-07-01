import appServer from './app';
import api from './routes/api';
import auth from './routes/auth';
import localStrategy from './routes/localStrategy';
import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';

const express = require('express');
const app = express(appServer);
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const passport = require('passport');

const Account = require('./models/account');

// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());

app.use(customCookieParser);

app.use(customQueryParser);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

passport.serializeUser(Account.serializeUser);
passport.deserializeUser(Account.deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);
app.use('/', auth);
app.use('/', localStrategy(passport));

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
