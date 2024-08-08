const mongoose = require("mongoose");

/**
 * Bus Stops from DataMall
 */
const BusStopSchema = mongoose.Schema({
	BusStopCode: {
		type: String,
		required: true,
	},
	RoadName: {
		type: String,
		required: true,
	},
	Description: {
		type: String,
		required: true,
	},
	Location: {
		type: { type: String, default: "Point" },
		coordinates: [Number],
	},
});

BusStopSchema.index({ Location: "2dsphere" });

module.exports = BusStop = mongoose.model("busstop", BusStopSchema);
