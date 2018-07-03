const express = require('express');
const router = express.Router();

import {applyParser, isExistPath} from '../helpers/template';
import {INDEX_FILE_NAME, TEMPLATE_MAPPER} from '../config/template.json';

router.get('/', function getIndexPage(req, res) {
    // Html-Server
    if (isExistPath(INDEX_FILE_NAME)) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });

        applyParser(res, INDEX_FILE_NAME, TEMPLATE_MAPPER);
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
        });
        res.end('error: file not exist!');
    }
});


module.exports = router;