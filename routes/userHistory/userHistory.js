var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const util = require('../../module/utils/utils');

const Program = require('../../models/programSchema');
const UserHistory = require('../../models/userHistorySchema');
const Stamp = require('../../models/stampSchema');

const jwt = require('jsonwebtoken');
const secretKey = "jwtSecretKey!";

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/:programId', async (req, res) => {
    const user = jwt.verify(req.headers.token, secretKey);

    const selectBerry = 'SELECT myBerry FROM User WHERE userIdx = ?'
    const updateBerry = 'UPDATE User SET myBerry = ? WHERE userIdx = ?';

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
                                "title" : "기부",
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
                        Stamp.find({
                            user_id: user.userIdx
                        }).then((stamp) => {
                            console.log("sssstamp" + stamp.cntStamp);
                            
                            //사용자 보유베리에서 기부값 마이너스 하기
                            // const myBerry = await pool.queryParam_Parse(selectBerry, [selectBerry[0]-req.body.donateBerry,user.userIdx]);
                            // const update = await pool.queryParam_Parse(updateBerry,[myBerry, user.userIdx] );   

                            if (stamp[0].cntStamp === 9) {
                                var random = Math.floor(Math.random() * 10) + 1;
                                var reward = Math.floor((stamp[0].totalBerry + parseInt(req.body.donateBerry)) * (random / 100));
                                console.log(random + "+++" + reward);

                                //사용자 보류 베리에 리워드 저장하기

                                Stamp.update(
                                    { user_id: user.userIdx },
                                    { $set: { cntStamp: 0, totalBerry: 0 } }
                                ).then((success) => {
                                    res.status(statusCode.OK).send(util.successTrue(statusCode.OK, resMessage.REWARD_SUCCESS, { reward: reward }));
                                });
                            } else {
                                Stamp.findOneAndUpdate(
                                    { user_id: user.userIdx },
                                    { $inc: { cntStamp: 1, totalBerry: parseInt(req.body.donateBerry) } },
                                    {
                                        upsert: true,
                                        new: true,
                                        runValidators: true
                                    }
                                ).then((success) => {
                                    res.status(statusCode.OK).send(util.successTrue(statusCode.OK, resMessage.STAMP_SUCCESS, success));
                                }).catch((err) => {
                                    res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
                                });
                            }
                        })
                        //res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, result));
                    }).catch((err) => {
                        console.log(err);
                    });
            }).catch((err) => {
                console.log(err);
                res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
            });
    }
});


module.exports = router;