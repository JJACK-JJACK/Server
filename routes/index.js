var express = require('express');
var router = express.Router();

router.use("/user", require("./user/index"));
router.use('/category', require('./category/index'));
router.use('/image', require('./image/index'));
router.use('/program', require('./program/index'));
router.use('/ranking', require('./ranking/index'));
router.use('/userHistory', require('./userHistory/index'));
router.use('/berryHistory', require('./berryHistory/index'));
router.use('/donate', require('./donate/index'));
router.use('/stamp', require('./stamp/index'));
router.use('/history', require('./history/index'));
router.use('/banking', require('./banking/index'));
router.use('/mypage', require('./mypage/index'));


module.exports = router;
