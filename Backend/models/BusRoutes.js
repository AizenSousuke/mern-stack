const mongoose = require('mongoose');

const BusRoutesSchema = mongoose.Schema({
    ServiceNo: {
        type: String,
        required: true
    },
    Operator: {
        type: String,
        required: true
    },
    Direction: {
        type: Number,
        required: true
    },
    StopSequence: {
        type: Number,
        required: true
    },
    BusStopCode: {
        type: String,
        required: true
    },
    Distance: {
        type: Number,
        required: true
    },
    WD_FirstBus: {
        type: String,
        required: true
    },
    WD_LastBus: {
        type: String,
        required: true
    },
    SAT_FirstBus: {
        type: String,
        required: true
    },
    SAT_LastBus: {
        type: String,
        required: true
    },
    SUN_FirstBus: {
        type: String,
        required: true
    },
    SUN_LastBus: {
        type: String,
        required: true
    }
});

module.exports = BusRoute = mongoose.model("busroutes", BusRoutesSchema);