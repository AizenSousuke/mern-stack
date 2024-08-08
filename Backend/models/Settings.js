const mongoose = require("mongoose");

/**
 * Bus Stop for Settings use
 */
const BusStopSettingsSchema = new mongoose.Schema({
	BusStopCode: {
		type: Number,
		required: true,
	},
	BussesTracked: {
		type: [Number],
		required: true,
		default: [],
	},
});

/**
 * Bus Stops for Settings use
 */
const BusStopsSettingsSchema = new mongoose.Schema({
	BusStops: {
		type: BusStopSettingsSchema,
		default: null,
	},
});

const SettingsSettingsSchema = new mongoose.Schema({
	GoingHome: {
		type: [BusStopsSettingsSchema],
		default: [],
	},
	GoingOut: {
		type: [BusStopsSettingsSchema],
		default: [],
	},
});

const SettingsSchema = new mongoose.Schema({
	UserId: {
		// Connect to an Id in another Model
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	Settings: {
		type: SettingsSettingsSchema,
		required: true,
		default: { GoingOut: [], GoingHome: [] },
	},
	DateCreated: {
		type: Date,
		required: true,
		default: Date.now,
	},
	DateUpdated: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

module.exports = Settings = mongoose.model("settings", SettingsSchema);
