import appServer from './app';
const express = require('express');
const app = express(appServer);
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;

import api from './middlewares/api';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';


app.use(cookieParser());// need cookieParser middleware before we can do anything with cookies

app.use(customCookieParser);

app.use(customQueryParser);

app.use('/api', api);

// let static middleware do its job
// app.use(express.static(__dirname + '/public'));

app.listen(port, () => console.log(`App listening on port ${port}!`));
