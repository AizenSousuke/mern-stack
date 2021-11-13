const mongoose = require('mongoose');

const BusStopSchema = mongoose.Schema({
    BusStopCode: {
        type: String,
        required: true
    },
    RoadName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Latitude: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    Longitude: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
});

module.exports = BusStop = mongoose.model('busstop', BusStopSchema);