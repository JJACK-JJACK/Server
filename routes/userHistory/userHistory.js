var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const util = require('../../module/utils/utils');

const pool = require('../../module/pool');

const Program = require('../../models/programSchema');
const UserHistory = require('../../models/userHistorySchema');
const Stamp = require('../../models/stampSchema');
const BerryHistory = require('../../models/berryHistorySchema');

const jwt = require('jsonwebtoken');
const secretKey = "jwtSecretKey!";

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/:programId', (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    var rewardBerry = 0;
    var stamps = 0;

    if (user === null || !req.body.donateBerry) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        Program.find({
                _id: req.params.programId
            })
            .then((program) => {

                UserHistory.findOneAndUpdate({
                        user_id: user.userIdx
                    }, {
                        $push: {
                            program: {
                                "program_id": program[0]._id,
                                "title": "기부",
                                "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                                "donateBerry": parseInt(req.body.donateBerry)
                            }
                        }
                    }, {
                        upsert: true,
                        new: true,
                        runValidators: true
                    })
                    .then((result) => {
                        Stamp.findOneAndUpdate({
                                user_id: user.userIdx
                            }, {
                                $inc: {
                                    cntStamp: 1,
                                    totalBerry: req.body.donateBerry
                                }
                            }, {
                                new: true,
                                upsert: true,
                                runValidators: true
                            })
                            .then(async (result) => {
                                stamps = result.cntStamp;
                                if(result.cntStamp >= 10){
                                    var random = Math.floor(Math.random() * 10) + 1;
                                    var reward = Math.floor((result.totalBerry) * (random / 100));
    
                                    BerryHistory.findOneAndUpdate({
                                        user_id: user.userIdx
                                    }, {
                                        $push: {
                                            charge: {
                                                "title": "베리 수확",
                                                "chargeBerry": reward,
                                                "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                                            }
                                        }
                                    }, {
                                        upsert: true,
                                        new: true,
                                        runValidators: true
                                    })
                                    .then(async (result) => {
                                        rewardBerry = reward;

                                        Stamp.findOneAndUpdate({
                                            user_id: user.userIdx
                                        }, {
                                        totalBerry : 0, cntStamp : 0
                                        }, {
                                            upsert: true,
                                            new: true,
                                            runValidators: true
                                        })
                                        .then(async (result) => {
                                            rewardBerry = reward;
    
                                            
                                        }).catch((err) => {
                                            res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
                                        });

                                    }).catch((err) => {
                                        res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
                                    });
                                }

                                const UpdateBerryQuery = 'UPDATE User SET myBerry = myBerry - ? WHERE userIdx = ?';
                                await pool.queryParam_Parse(UpdateBerryQuery, [req.body.donateBerry, user.userIdx]);

                                Program.findOneAndUpdate({
                                    _id: req.params.programId
                                }, {
                                    $inc: {
                                        totalBerry: req.body.donateBerry,
                                    }
                                }, {
                                    new: true,
                                    upsert: true,
                                    runValidators: true
                                }) .then(async (result) => {
                                    res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, {"totalBerry" : result.totalBerry, "stamps": stamps, "rewordsBerry" : rewardBerry }));
                                    console.log(err);
                                    res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                                });

                            }).catch((err) => {
                                console.log(err);
                                res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                            });
                    }).catch((err) => {
                        console.log(err);
                        res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
                    });
            }).catch((err) => {
                console.log(err);
                res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
            });
    }
});

module.exports = router;