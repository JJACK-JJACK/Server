const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const berryHistorySchema = new mongoose.Schema({
    user_id: { type: Number, required: true},
    charge : { type: Array, required: true},
}, {
    versionKey: false,
});

module.exports = mongoose.model('BerryHistory', berryHistorySchema);
