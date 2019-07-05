var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const jwtUtils = require('../../module/jwt');

const pool = require('../../module/pool');

router.get('/', async (req, res) => {
    const selectUserQuery = 'SELECT userIdx FROM User WHERE token = ?';
    const userIdxResult = await pool.queryParam_Parse(selectUserQuery, [req.headers.token]);

    if (userIdxResult[0] == null) {
        res.status(200).send(util.successFalse(statusCode.NO_USER, resMessage.NO_USER));
    } else {
        const selectStamp = 'SELECT SUM(totalStamp) sumStamp FROM Stamp WHERE userIdx = ?';
        const selectStampResult = await pool.queryParam_Parse(selectStamp, userIdxResult[0].userIdx);

        if (selectStampResult[0] == null) {
            res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.STAMP_ERROR));
        } else {
            const resData = {
                totalStamp: selectStampResult[0].sumStamp,
            }
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.STAMP_SUCCESS, resData));
        }

    }
});

router.post('/', async (req, res) => {
    const selectUserQuery = 'SELECT userIdx FROM User WHERE token = ?';
    const userIdxResult = await pool.queryParam_Parse(selectUserQuery, [req.headers.token]);

    if (userIdxResult[0] == null) {
        res.status(200).send(util.successFalse(statusCode.NO_USER, resMessage.NO_USER));
    } else {
        const selectStamp = 'SELECT SUM(totalStamp) FROM Stamp WHERE userIdx = ?';
        const selectStampResult = await pool.queryParam_Parse(selectStamp, userIdxResult[0].userIdx);

        if (selectStampResult[0] == null) {
            res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.STAMP_ERROR));
        } else {
            const resData = {
                totalStamp: selectStampResult.totalStamp,
                //totalBerry: selectStampResult.totalBerry
            }
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.STAMP_SUCCESS, resData));
        }

    }
});

module.exports = router;