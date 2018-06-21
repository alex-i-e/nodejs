const cookieParser = require('cookie-parser');

export default (req, res, next) => {
	req.parsedCookies = cookieParser.JSONCookies(req.cookies);

	next();
}