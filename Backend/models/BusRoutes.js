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
        type: Number,
        required: true
    },
    Distance: {
        type: Integer128,
        required: true
    },
    WD_FirstBus: {
        type: Number,
        required: true
    },
    WD_LastBus: {
        type: Number,
        required: true
    },
    SAT_FirstBus: {
        type: Number,
        required: true
    },
    SAT_LastBus: {
        type: Number,
        required: true
    },
    SUN_FirstBus: {
        type: Number,
        required: true
    },
    SUN_LastBus: {
        type: Number,
        required: true
    }
});

module.exports = BusRoute = mongoose.model("busroutes", BusRoutesSchema);