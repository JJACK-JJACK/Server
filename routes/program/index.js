var express = require('express');
var router = express.Router();

router.use('/', require('./program'));

module.exports = router;
