var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const Program = require('../../models/programSchema');
const UserHistory = require('../../models/userHistorySchema');

const jwt = require('../../module/jwt');

function custom_sort(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}

router.get('/', async (req, res) => {

    const user = jwt.verify(req.headers.token);

    UserHistory.find({
        user_id: user.userIdx
    }).then((history) => {

        var programHistory = [];

        if (history[0] == null) {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, programHistory));
        } else {

            history[0]["program"].forEach(function (item) {
                Program.findOne({
                    _id: item.program_id
                }).then((result) => {
                    programHistory.push({"result": result, "date": item.date});
                    if (programHistory.length == history[0]["program"].length) {
                        programHistory.sort(custom_sort);
                        var donates = [];
                        programHistory.forEach(function (item) {
                            console.log(item.result._id);
                            donates.push(item.result);
                        delete item.date;
                        });
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, donates));
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });
        }
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
    const user = jwt.verify(req.headers.token);

    UserHistory.find({
        user_id: user.userIdx
    }, ).then((history) => {
        var donateBerry = [];
        if (history[0] == null) {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, donateBerry));
        } else {
            history[0]["program"].forEach(function (item) {
                var donateJson = new Object();
                donateJson.berry = (item.donateBerry);
                donateJson.id = (item.program_id);
                console.log(donateJson);
                donateBerry.push(donateJson);
                console.log(donateBerry);
            });
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, donateBerry));
        }
    }).catch((err) => {
        console.log(err);
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });
});

module.exports = router;