const {request} = require('http');

export default require('http')
    .createServer()
    .on('request', (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
        });
        req.pipe(res);
    })
    .listen(3000);