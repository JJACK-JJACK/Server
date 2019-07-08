var express = require('express');
var router = express.Router();

router.use('/', require('./donate'));

module.exports = router;
