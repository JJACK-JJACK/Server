var express = require('express');
var router = express.Router();

router.use('/test', require('./test'));
router.use('/jwtTest', require('./jwtTest'));
router.use('/jwtModule', require('./jwtModule'));

module.exports = router;
