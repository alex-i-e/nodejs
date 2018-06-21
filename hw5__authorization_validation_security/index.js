import appServer from './app';
const express = require('express');
const app = express(appServer);
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;

import api from './routes/api';
import customErrorHandler from './middlewares/customErrorHandler';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';

// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());

app.use(customCookieParser);

app.use(customQueryParser);

app.use('/api', api);

app.use(customErrorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
