const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true},
    thumbnail: { type: String, required: true},
}, {
    versionKey: false,
});

categorySchema.pre('save', function() {
});

module.exports = mongoose.model('Category', categorySchema);