var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const StampSchema = require('../../models/stampSchema');

const pool = require('../../module/pool');

const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey!"; //임의 설정, 다르게 해도 됨, 깃헙 공유 드라이브 올리지 말기

router.get('/', async (req, res) => {
    const user = jwt.verify(req.headers.token, secretOrPrivateKey);

    StampSchema.find(
        { user_id: user.userIdx }
    ).then((stamp) => {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, {cntStamp:stamp[0].cntStamp}));
    }).catch((err) => {
        console.log(err);
        res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });
});

module.exports = router;