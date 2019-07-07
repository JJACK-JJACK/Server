var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const utils = require('../../module/utils/utils');

const Program = require('../../models/programSchema');
const UserHistory = require('../../models/userHistorySchema');

const jwt = require('jsonwebtoken');
const secretKey = "jwtSecretKey!";

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/:programId', (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    console.log(user);

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
                            "donateDate": moment().format('YYYY-MM-DD HH:mm:ss'),
                            "donateBerry": req.body.berry
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
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });
});

module.exports = router;