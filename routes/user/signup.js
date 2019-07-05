var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const pool = require('../../module/pool');
const crypto = require('crypto-promise');

router.post('/', async (req, res) => {
    const selectEmailQuery = 'SELECT email FROM User WHERE email = ?';
    const selectEmailResult = await pool.queryParam_Parse(selectEmailQuery, [req.body.email]);

    const email = req.body.email;
    const nickname = req.body.nickname;
    const password = req.body.password;

    if (selectEmailResult[0] == null) {
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(password.toString(), salt, 1000, 32, 'SHA512');

        const insertSignupQuery =
            'INSERT INTO User (email, nickname, password, salt, token, myBerry, totalBerry, totalDonate) VALUES (?, ?, ?, ?, 0, 0, 0, 0)';
        const insertSignupResult = await pool.queryParam_Parse(insertSignupQuery, [email, nickname, hashedPw.toString('base64'), salt]);

        if (!insertSignupResult) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.CREATED_USER_FAIL));
        } else {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.CREATED_USER_SUCCESS));
        }
    } else {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER));
    }
});

module.exports = router;