var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtil = require('../../module/utils/authUtils');

const jwtUtils = require('../../module/jwt');

const crypto = require('crypto-promise');
const pool = require('../../module/pool');
const jwt = require('jsonwebtoken');

const secretOrPrivateKey = "jwtSecretKey!"; //임의 설정, 다르게 해도 됨, 깃헙 공유 드라이브 올리지 말기


router.post('/', async (req, res) => {
    const selectIdQuery = 'SELECT * FROM User WHERE email = ?';
    const selectResult = await pool.queryParam_Parse(selectIdQuery, [req.body.email]);
    const pwd = req.body.password;
    const userIdx = selectResult[0].userIdx;

    if (req.body.id === null || !req.body.password) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        if (selectResult[0] == null) {
            res.status(200).send(util.successFalse(statusCode.NO_USER, resMessage.NO_USER));
        } else {
            const hashedPw = await crypto.pbkdf2(pwd.toString(), selectResult[0].salt, 1000, 32, 'SHA512');

            if (selectResult[0].password == hashedPw.toString('base64')) {
                
                const payload = { //어떤 데이터를 넣으지는 플젝에 맞게 하면 됨, 여기에 많은 데이터를 넣었을때 이걸 해팅당하면 망
                    userIdx: userIdx,
                    email: req.body.email
                };
            
                const jwtToken = jwt.sign(payload, secretOrPrivateKey);

                res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, jwtToken));
            } else {
                res.status(200).send(util.successFalse(statusCode.NOT_FOUND, resMessage.MISS_MATCH_PW));
            }
        }

    }
});

module.exports = router;