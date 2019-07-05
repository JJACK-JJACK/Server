var express = require('express');
var router = express.Router();

router.use("/user", require("./user/index"));
router.use("/history", require("./history/index"));


module.exports = router;
