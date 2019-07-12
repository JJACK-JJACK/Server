var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const pool = require('../../module/pool');

router.post('/', async (req, res) => {
    const nickNameQuery = 'SELECT nickname FROM User WHERE nickname = ?';
    const nickNameResult = await pool.queryParam_Parse(nickNameQuery, [req.body.nickname]);

    if (req.body.nickname === null) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        if (nickNameResult[0] == null) {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.AVAILABLE_NICKNAME));
        } else {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.DUPLICATION_NICKNAME));
        }

    }
});

module.exports = router;