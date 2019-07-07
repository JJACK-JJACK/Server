const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const userHistorySchema = new mongoose.Schema({
    user_id: { type: Number, required: true},
    program : { type: Array, required: true},
}, {
    versionKey: false,
});

module.exports = mongoose.model('UserHistory', userHistorySchema);
