var express = require('express');
var router = express.Router();

router.use('/', require('./ranking'));

module.exports = router;
