var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const StampSchema = require('../../models/stampSchema');

const jwt = require('../../module/jwt');

router.get('/', async (req, res) => {
    const user = jwt.verify(req.headers.token);

    StampSchema.find(
        { user_id: user.userIdx }
    ).then((stamp) => {
        if(stamp[0] == null){
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, {cntStamp:0}));
        }else{
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.READ_SUCCESS, {cntStamp:stamp[0].cntStamp}));
        }
    }).catch((err) => {
        console.log(err);
        res.status(statusCode.OK).send(util.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });
});

module.exports = router;