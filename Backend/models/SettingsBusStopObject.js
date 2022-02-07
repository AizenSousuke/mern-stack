const mongoose = require("mongoose");

// Each bus stop which busses are tracked are reflected in this schema
const SettingsBusStopObjectSchema = mongoose.Schema({
    GoingOut: {
        type: Boolean,
        required: true,
        default: true
    },
    BusStopCode: {
        type: Number,
        required: true
    },
    BussesTracked: {
        type: [Number],
        required: true,
        default: [],
        
    }
});

module.exports = SettingsBusStopObject = mongoose.model("settingsbusstopobject", SettingsBusStopObjectSchema);