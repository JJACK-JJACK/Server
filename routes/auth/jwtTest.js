var express = require('express');
var router = express.Router();

const utils = require('../../module/utils/utils');
const authUtil = require('../../module/utils/authUtils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');

const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey!";
const options = {
    algorithm: "HS256",
    expiresIn: "1h",
    issuer: "genie"
};

//토큰 발급
router.post('/signin', (req, res) => {
    const payload = {
        idx: req.body.idx,
        id: req.body.id,
        grade: req.body.grade
    };
    //grade가 0이면 일반회원, 1이면 관리자라 가정

    const jwtToken = jwt.sign(payload, secretOrPrivateKey, options);
    res.status(statusCode.OK).send(utils.successTrue(statusCode.OK, resMessage.CREATE_TOKEN, { "token" : jwtToken}));
});

//토큰 해독: 회원의 데이터를 가져온다 가정
router.get('/user', (req, res) => {
    try {
        const decodedToken = jwt.verify(req.headers.token);
        console.log(decodedToken);

        if (decodedToken.grade == 0) {
            res.status(200).send(utils.successFalse((statusCode.BAD_REQUEST, resMessage.NO_SELECT_AUTHORITY)));
        } else {
            res.status(200).send(utils.successTrue((statusCode.OK, resMessage.USER_SELECTED)));
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
