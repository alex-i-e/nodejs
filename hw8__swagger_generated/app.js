'use strict';
import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import mongoose from 'mongoose';
import {db} from "./config/config.json";

const bodyParser = require('body-parser');
const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing


var config = {
    appRoot: __dirname // required config
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }

    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 10010;
    app.use(require('morgan')('dev'));
    app.use(require('cookie-parser')());
    app.use(customCookieParser);
    app.use(customQueryParser);
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
    app.use(customErrorHandler);

    app.listen(port);

    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
    }
});
