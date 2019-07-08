var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const utils = require('../../module/utils/utils');

const BerryHistory = require('../../models/berryHistory');

const jwt = require('jsonwebtoken');
const secretKey = "jwtSecretKey!";

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/', (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    BerryHistory.findOneAndUpdate({
        user_id: user.userIdx
    }, {
        $push: {
            charge: {
                "chargeBerry": parseInt(req.body.chargeBerry),
                "date": moment().format('YYYY-MM-DD HH:mm:ss'),
            }
        }
    }, {
        upsert: true,
        new: true,
        runValidators: true
    })
    .then((result) => {
        res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, result));
    }).catch((err) => {
        res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
    });
});

module.exports = router;