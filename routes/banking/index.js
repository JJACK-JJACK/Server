var express = require('express');
var router = express.Router();

router.use('/', require('./banking'));

module.exports = router;
