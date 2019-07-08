var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const jwtUtils = require('../../module/jwt');
const authUtil = require('../../module/utils/authUtils');

const pool = require('../../module/pool');
const Program = require('../../models/programSchema');
const UserHistory = require('../../models/userHistorySchema');

const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey!"; //임의 설정, 다르게 해도 됨, 깃헙 공유 드라이브 올리지 말기

router.get('/', async (req, res) => {

    const user = jwt.verify(req.headers.token, secretOrPrivateKey);

    UserHistory.find(
        { user_id: user.userIdx },
    ).then((history) => {
        var donateBerry = {};
        history[0]["program"].forEach(function (item) {
            donateBerry.donateBerry = (item.donateBerry);
        });
        Program.find({
            _id: { $in: programs }
        }).then((result) => {
            console.log(`result arr ${result}`);
            result.donateBerry = donateBerry;

            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, result));
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });
});

router.get('/detail/:programId', async (req, res) => {

    Program.find({
        _id: req.params.programId
    })
        .then((program) => {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, program));
        }).catch((err) => {
            console.log(err);
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });
});

router.get('/berry', async (req, res) => {
    const user = jwt.verify(req.headers.token, secretOrPrivateKey);

    UserHistory.find(
        { user_id: user.userIdx },
    ).then((history) => {
        var donateBerry = [];
        
        var donateArray = new Array();

        history[0]["program"].forEach(function (item) {
            var donateJson = new Object();
            donateJson.berry = (item.donateBerry);
            donateJson.id = (item.program_id);
            console.log(donateJson);
            donateBerry.push(donateJson);
            //donateArray.add(donateJson);
            console.log(donateBerry);
        });

        res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, donateBerry));
    }).catch((err) => {
        console.log(err);
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });
});

module.exports = router;