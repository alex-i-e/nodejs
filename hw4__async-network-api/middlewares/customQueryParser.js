const urlParser = require('url');
const querystring = require('querystring');

export default (req, res, next) => {
	const query = urlParser.parse(req.url).query;
	console.log('query >>>', query);

	const params = querystring.parse(query);
	console.log('params >>>', params);

	const { url, method } = req;
	console.log('<url> [method] >>>', `<${url}> [${method}]`);

	const urlArr = url.slice(1).split('/');
	res.locals.parsedQuery = urlArr;

	next();
}