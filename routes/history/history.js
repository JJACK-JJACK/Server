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

    const programIdxQuery = 'SELECT programIdx FROM UserHistory WHERE userIdx = ?';
    const programIdxResult = await pool.queryParam_Parse(programIdxQuery, user.idx);

    if (programIdxResult[0] == null) {
        res.status(200).send(util.successFalse(statusCode.NOT_FOUND, resMessage.NO_DATA));
    } else {
        
        Program.find({
            _id: programIdxResult[0].programIdx
        })
            .then((program) => {
                console.log(program[0].review.plan);
                const resData = {
                    program,
                }
                res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS,program));
            }).catch((err) => {
                console.log(err);
                res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
            });

        //res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, resData));

        //res.status(200).send(util.successFalse(statusCode.NOT_FOUND, resMessage.MISS_MATCH_PW));
    }
});

module.exports = router;