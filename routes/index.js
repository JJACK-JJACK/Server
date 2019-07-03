var express = require('express');
var router = express.Router();

router.use("/user", require("./user/index"));
router.use("/donation_history", require("./donation_history/index"));


module.exports = router;
