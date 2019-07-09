var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const util = require('../../module/utils/utils');

const async = require('async');
const BerryHistory = require('../../models/berryHistorySchema');
const UserHistory = require('../../models/userHistorySchema');
const Program = require('../../models/programSchema');

const jwt = require('jsonwebtoken');
const secretKey = "jwtSecretKey!";

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

function custom_sort(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}

router.get('/', (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    BerryHistory.find({
            user_id: user.userIdx
        })
        .then((history) => {
            var bank = [];

            history[0]["charge"].forEach(function (item) {
                item.chargeBerry = "-".concat(item.chargeBerry);
                item.berry = item.chargeBerry;
                delete item.chargeBerry;
                bank.push(item);
            });

            UserHistory.find({
                    user_id: user.userIdx
                })
                .then(async (history) => {
                    var programs = [];
                    history[0]["program"].forEach(function (item) {
                        Program.find({
                                _id: item.program_id
                            })
                            .then((program) => {
                                var centerName = program[0].centerName;
                                delete item.program_id;
                                item.donateBerry = "+".concat(item.donateBerry);
                                item.centerName = centerName;
                                item.berry = item.donateBerry;
                                delete item.donateBerry;
                                bank.push(item);
                                programs.push(item);

                                if (programs.length == history[0]["program"].length) {
                                    bank.sort(custom_sort);
                                    res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, {"user_id": user.userIdx,"history": bank }));
                                }

                            }).catch((err) => {
                                console.log(err);
                                res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                            });
                    });
                }).catch((err) => {
                    console.log(err);
                    res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                });
        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });

});

module.exports = router;