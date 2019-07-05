var express = require('express');
var router = express.Router();

router.use("/user", require("./user/index"));
router.use("/history", require("./history/index"));
router.use('/board', require('./board/index'));
router.use('/category', require('./category/index'));
router.use('/image', require('./image/index'));
router.use('/program', require('./program/index'));
router.use('/ranking', require('./ranking/index'));

module.exports = router;
