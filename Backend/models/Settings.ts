// import mongoose from "mongoose";

// /**
//  * Bus Stop for Settings use
//  */
// const BusStopSettingsSchema = new mongoose.Schema({
// 	BusStopCode: {
// 		type: Number,
// 		required: true,
// 	},
// 	BusesTracked: {
// 		type: [Number],
// 		required: true,
// 		default: [],
// 	},
// });

// const SettingsSettingsSchema = new mongoose.Schema({
// 	GoingHome: {
// 		type: [BusStopSettingsSchema],
// 		default: [],
// 	},
// 	GoingOut: {
// 		type: [BusStopSettingsSchema],
// 		default: [],
// 	},
// });

// const SettingsSchema = new mongoose.Schema({
// 	UserId: {
// 		// Connect to an Id in another Model
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: "user",
// 		required: true,
// 	},
// 	Settings: {
// 		type: SettingsSettingsSchema,
// 		required: true,
// 		default: { GoingOut: [], GoingHome: [] },
// 	},
// 	DateCreated: {
// 		type: Date,
// 		required: true,
// 		default: Date.now,
// 	},
// 	DateUpdated: {
// 		type: Date,
// 		required: true,
// 		default: Date.now,
// 	},
// });

// const Settings = mongoose.model("settings", SettingsSchema);

// export default Settings;