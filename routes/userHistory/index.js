var express = require('express');
var router = express.Router();

router.use('/', require('./userHistory'));

module.exports = router;
