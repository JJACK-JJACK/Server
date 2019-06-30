var express = require('express');
var router = express.Router();

const utils = require('../../module/utils/utils');
const authUtil = require('../../module/utils/authUtils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');

const jwtUtils = require('../../module/jwt');

//로그인 : 토큰 발급
router.post('/signin', (req, res) => {
    if (req.body.idx === null || !req.body.grade || !req.body.name) {
        res.status(statusCode.OK).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        const tokens = jwtUtils.sign(req.body);
        //발급받은 refreshToken을 user DB에 저장해줘야함 (지금은 생략)
        //클라이언트에게 refreshToken을 안전한 저장소에 저장해달라고 설명
        res.status(statusCode.OK).send(utils.successTrue(statusCode.OK, resMessage.CREATE_TOKEN, tokens));
    }
});

//토큰 재발급
router.get('/refresh', (req, res) => {
    //헤더로 보낼경우 대소문자 구분이 안됩니다. 직접 확인해보시면 더 조아요~
    const refreshToken = req.headers.refreshtoken;

    //DB에서 해당 refreshToken을 가진 User를 찾음
    //찾은 유저라고 가정
    const selectUser = {
        idx: 1,
        grade: 1,
        id: 'genie',
        name: 'genie'
    };

    const newAccessToken = jwt.refresh(selectUser);
    res.status(statusCode.OK).send(utils.successTrue(statusCode.OK, resMessage.REFRESH_TOKEN, tokens));
});

//미들웨어 사용
router.get('/', authUtil.isLoggedin, (req, res) => {
    console.log(req.decoded);
});

module.exports = router;
