const urlParser = require('url');
const querystring = require('querystring');

export default (req, res, next) => {
	const query = urlParser.parse(req.url).query;
	const params = querystring.parse(query);

	req.parsedQuery = JSON.stringify(params);

	next();
}