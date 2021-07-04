const mongoose = require('mongoose');

const auctionDateSchema = mongoose.Schema({
    time: {type: String, required: true},
    day: {type: String, required: true},
    month: {type: String, required: true},
    year: {type: String, required: true}
});


const assetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    minimumBid: {
        type: Number,
        required: true
    },
    openingDate: {
        type: auctionDateSchema,
        required: true
    },
    closingDate: {
        type: auctionDateSchema,
        required: true
    }

});


module.exports = mongoose.model('asset', assetSchema);