var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const util = require('../../module/utils/utils');

const BerryHistory = require('../../models/berryHistorySchema');

const pool = require('../../module/pool');

const jwt = require('../../module/jwt');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/', (req, res) => {

    const user = jwt.verify(req.headers.token);

    if (user === null || !req.body.chargeBerry) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        BerryHistory.findOneAndUpdate({
                user_id: user.userIdx
            }, {

                $push: {
                    charge: {
                        "title": "충전",
                        "chargeBerry": parseInt(req.body.chargeBerry),
                        "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                    }
                }
            }, {
                upsert: true,
                new: true,
                runValidators: true
            })
            .then(async (result) => {

                const UpdateBerryQuery = 'UPDATE User SET myBerry = myBerry + ? WHERE userIdx = ?';
                await pool.queryParam_Parse(UpdateBerryQuery, [req.body.chargeBerry, user.userIdx]);

                res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, result));
            }).catch((err) => {
                res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
            });
    }
});

router.get('/myBerry', async (req, res) => {

    const user = jwt.verify(req.headers.token);

    const SelectBerryQuery = 'SELECT myBerry FROM User WHERE userIdx = ?';
    const SelectResult = await pool.queryParam_Parse(SelectBerryQuery, [user.userIdx]);

    if (SelectResult[0] == null) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL, 0 ));
    } else {
        res.status(statusCode.OK).send(util.successTrue(statusCode.CREATED, resMessage.READ_SUCCESS, SelectResult[0].myBerry));
    }
});

module.exports = router;