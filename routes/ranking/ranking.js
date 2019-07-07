var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const utils = require('../../module/utils/utils');

const Program = require('../../models/programSchema');
const UserHistory = require('../../models/userHistorySchema');

router.get('/', async (req, res) => {
    Program.find({
            state: 2
        }).sort({
            start: -1
        }).limit(10)
        .then((allPrograms) => {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, allPrograms));
        }).catch((err) => {
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });
});

router.get('/:categoryId', async (req, res) => {
    UserHistory.find()
        .populate({
            path: 'Program',
            select: 'categoryId',
            match: {
                categoryId: req.params.categoryId,
            },
        }).exec(function (err, history) {
            if (err) {
                res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
            }
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, history));
        });
});

module.exports = router;
