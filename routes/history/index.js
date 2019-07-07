var express = require('express');
var router = express.Router();

router.use('/', require('./history'));
//router.use('/detail', require('./detail'));
router.use('/stamp', require('./stamp'));

module.exports = router;
