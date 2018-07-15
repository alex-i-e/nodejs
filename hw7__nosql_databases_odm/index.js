import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import mongoose from 'mongoose';
import {db} from "./config/config.json";
// import './db/testNativeRandom';
// import './db/testMongooseRandom';
// import './db/fillDatabase';


const app = require('express')(require('http').createServer());
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

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
app.use('/api', require('./routes/cityApi'));
app.use('/api', require('./routes/userApi'));
app.use('/api', require('./routes/productApi'));
app.use('/api', require('./routes/errorCatcherApi'));

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
