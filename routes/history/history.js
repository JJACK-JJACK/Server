var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const jwtUtils = require('../../module/jwt');
const authUtil = require('../../module/utils/authUtils');

const pool = require('../../module/pool');
const Program = require('../../models/programSchema');

const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey!"; //임의 설정, 다르게 해도 됨, 깃헙 공유 드라이브 올리지 말기

router.get('/', async (req, res) => {

    const user = jwt.verify(req.headers.token, secretOrPrivateKey);
    console.log("userData:::" + JSON.stringify(user));

    const programIdxQuery = 'SELECT programIdx FROM UserHistory WHERE userIdx = ?';
    var programIdxResult = await pool.queryParam_Parse(programIdxQuery, user.userIdx);
    if (programIdxResult[0] == null) {
        res.status(200).send(util.successFalse(statusCode.NOT_FOUND, resMessage.NO_DATA));
    } else {
        console.log(JSON.stringify(user.userIdx));

        const donateQuery = 'SELECT COUNT(*) donateCnt, SUM(donateBerry) donateSum FROM UserHistory WHERE userIdx = ?';
        const donate = await pool.queryParam_Parse(donateQuery, user.userIdx);

        var resData = {
            "donateCnt": donate[0].donateCnt,
            "donateSum": donate[0].donateSum
        }

        var i;
        console.log("length:::"+programIdxResult.length);
        Program.find({
            _id: {$in: programIdxResult}
        })
        for (i=0; i < programIdxResult.length; i++) {
            Program.find({
                _id: programIdxResult[i].programIdx
            })
                .then((program) => {
                    console.log(`2:::iii ${i}`);

                    resData.program = program;
                    if(i == programIdxResult.length){
                        res.status(200).send(util.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS));

                        res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, resData));
                    }

                    //console.log(program._id+":::"+JSON.stringify(resData));
                }).catch((err) => {
                    console.log(err);
                    res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                });
        }

    }
});

module.exports = router;