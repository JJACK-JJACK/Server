const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const programSchema = new mongoose.Schema({
    title: { type: String, required: true},
    centerName: { type: String, required: true},
    thumbnail: { type: String, required: true},
    story: { type: Array, default:[]},
    plan: { type: Array, default:[]},
    start: { type: Date, required: true},
    finish: { type: Date, required: true},
    deliver: { type: Date, required: true},
    state: { type: Number, default: 0},
    totalBerry : { type: Number, default: 0, min: 0},
    maxBerry : { type: Number, default: 0, min: 0},
    percentage : { type: Number, default: 0, min: 0},
    categoryId : { type: Number, required: true},
    review : { type: Array, default:[]},
}, {
    versionKey: false,
});

programSchema.pre('save', function(next) {
    if (!this.percentage) this.percentage = parseInt((this.totalBerry/this.maxBerry)*100);
    if(this.totalBerry > this.maxBerry){
        next(new Error("totalBerry can not be bigger than maxBerry"));
    }
    next();
});

programSchema.virtual('dday').get(function() {
    return Math.floor((this.finish-moment().format('YYYY-MM-DD HH:mm:ss')) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Program', programSchema);