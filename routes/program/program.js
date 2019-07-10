var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const utils = require('../../module/utils/utils');

const Program = require('../../models/programSchema');

router.get('/detail/:programId', async (req, res) => {

    Program.find({
            _id: req.params.programId
        })
        .then((program) => {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, program));
        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });
});

router.get('/:categoryId', async (req, res) => {

    Program.find({
            categoryId: req.params.categoryId
        })
        .then((program) => {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, program));
        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });
});

router.get('/:categoryId/:filterId', async (req, res) => {

    switch (req.params.filterId) {
        case "0":
            Program.find({
                    categoryId: req.params.categoryId
                }).sort({
                    start: -1
                })
                .then((program) => {
                    res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, program));
                }).catch((err) => {
                    console.log(err);
                    res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                });
            break;
        case "1":
            Program.find({
                    categoryId: req.params.categoryId
                }).sort({
                    percentage: -1
                })
                .then((program) => {
                    res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, program));
                }).catch((err) => {
                    console.log(err);
                    res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                });
            break;
        case "2":
            Program.find({
                    categoryId: req.params.categoryId
                }).sort({
                    percentage: 1
                })
                .then((program) => {
                    res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, program));
                }).catch((err) => {
                    console.log(err);
                    res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
                });
            break;
    }
});

router.post('/', (req, res) => {

    Program.create(req.body)
        .then((result) => {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, result));
        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
        });
});

router.get('/', (req, res) => {
    Program.aggregate([
            {
                $group: {
                    _id: "기부 총 금액",
                    totalDonate: {
                        $sum: "$totalBerry"
                    }, 
                }
            }])
        .then((result) => {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, result));
        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
        });
});

module.exports = router;
