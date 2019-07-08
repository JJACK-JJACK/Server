var express = require('express');
var router = express.Router();

router.use('/', require('./stamp'));

module.exports = router;
