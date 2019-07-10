var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const UserHistory = require('../../models/userHistorySchema');

const pool = require('../../module/pool');

const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey!"; //임의 설정, 다르게 해도 됨, 깃헙 공유 드라이브 올리지 말기

router.get('/', async (req, res) => {

    const user = jwt.verify(req.headers.token, secretOrPrivateKey);
    var resData = {};

    UserHistory.find({
        user_id: user.userIdx
    }).then((history) => {
        if (history.length == 0) {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, resData));
        } else {
            var programs = [];
            history[0]["program"].forEach(function (item) {
                programs.push(item.donateBerry);
            });

            var total = 0;
            for (var i in programs) {
                total += programs[i];
            }

            resData.donateBerry = total;
            resData.donate = programs.length;
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, resData));
        }
    }).catch((err) => {
        console.log(err);
        res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });
});

module.exports = router;