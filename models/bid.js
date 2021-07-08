const mongoose = require('mongoose');
const bidSchema = mongoose.Schema({
    assetName: {
        type: String,
        required: true
    },
    bidders: {
        type: Array,
        required: false
    },
    prices: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('bid', bidSchema);