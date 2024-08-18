import mongoose from "mongoose";

/**
 * Schema from LTA DataMall API
 */
const BusServicesSchema = new mongoose.Schema({
	ServiceNo: {
		type: String,
		required: true,
	},
	Operator: {
		type: String,
		required: true,
	},
	Direction: {
		type: Number,
		required: true,
	},
    Category: {
        type: String,
        required: true,
    },
    OriginCode: {
        type: String,
        required: true,
    },
    DestinationCode: {
        type: String,
        required: true,
    },
    AM_Peak_Freq: {
        type: String,
        required: true,
    },
    AM_Offpeak_Freq: {
        type: String,
        required: true,
    },
    PM_Peak_Freq: {
        type: String,
        required: true,
    },
    PM_Offpeak_Freq: {
        type: String,
        required: true,
    },
    LoopDesc: {
        type: String,
    },
});

const BusServices = mongoose.model("BusServices", BusServicesSchema);

export default BusServices;