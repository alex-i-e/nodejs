const cookieParser = require('cookie-parser');

export default (req, res, next) => {
	res.locals.parsedCookies = cookieParser.JSONCookies(req.cookies);

	next();
}