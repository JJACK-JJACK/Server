var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const util = require('../../module/utils/utils');

const pool = require('../../module/pool');

const jwt = require('jsonwebtoken');
const secretKey = "jwtSecretKey!";

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/nickname', async (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    if (user === null || !req.body.nickname) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        const UpdateUserQuery = 'UPDATE User SET nickname = ? WHERE userIdx = ?';
        await pool.queryParam_Parse(UpdateUserQuery, [req.body.nickname, user.userIdx]);

        res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS));

        }
});

router.post('/profile', async (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    if (user === null || !req.body.profile) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        const UpdateUserQuery = 'UPDATE User SET profileImg = ? WHERE userIdx = ?';
        await pool.queryParam_Parse(UpdateUserQuery, [req.body.profile, user.userIdx]);

        res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS));

        }
});

router.get('/user', async (req, res) => {

    const user = jwt.verify(req.headers.token, secretKey);

    if (user === null) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        const SelectUserQuery = 'SELECT * FROM User WHERE userIdx = ?';
        const result = await pool.queryParam_Parse(SelectUserQuery, [user.userIdx]);

        delete result[0].password;
        delete result[0].salt;
        
        res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS,result));

        }
});

module.exports = router;