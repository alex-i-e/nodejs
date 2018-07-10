import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import mongoose from 'mongoose';
import {db} from "./config/config.json";
// import './db/testNative';

const app = require('express')(require('http').createServer());
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url);

const dbClient = {};

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const City = new Schema({
    name: {type: String, default: 'Minsk', match: /[a-z]/},
    country: {type: String, default: 'Belarus', match: /[a-z]/},
    capital: {type: Boolean, default: true},
    location: {
        lat: {type: Number/*, index: true*/},
        long: {type: Number/*, index: true*/}
    }
});


// a setter
City.path('name').set(cityName => capitalize(cityName));
// a setter
City.path('country').set(countryName => capitalize(countryName));

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}


// middleware
City.pre('save', function (next) {
    // notify(this.get('email'));
    console.log(' > pre Save > [city]');
    next();
});

const CityModel = mongoose.model('City', City);
const cityInstance = new CityModel();

console.log(' >>> cityInstance=', cityInstance);

cityInstance.capital = true;
cityInstance.save(function (err, data) {
    if (!err) console.log('Success!');
    console.log(' >>> data=', data);
});


CityModel.find({}, function (err, docs) {
    // docs.forEach
    console.log(' >>> docs=', docs);
});


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
