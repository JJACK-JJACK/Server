var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const utils = require('../../module/utils/utils');
const pool = require('../../config/dbConfig');
const Program = require('../../models/programSchema');

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
    Program.find({
            categoryId: req.params.categoryId
        })
        .then((program) => {
            let program_id = Object.values(program);
            console.log(program_id);

        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
        });
});

module.exports = router;
