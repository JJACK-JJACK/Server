const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const stampSchema = new mongoose.Schema({
    user_id: { type: Number, required: true},
    cntStamp: { type: Number, default: 0, min: 0},
    totalBerry : { type: Number, default: 0, min: 0},
}, {
    versionKey: false,
});

module.exports = mongoose.model('Stamp', stampSchema);
