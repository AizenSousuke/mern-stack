// const mongoose = require("mongoose");

// /**
//  * Schema from LTA DataMall API
//  */
// const BusStopSchema = mongoose.Schema({
// 	BusStopCode: {
// 		type: String,
// 		required: true,
// 	},
// 	RoadName: {
// 		type: String,
// 		required: true,
// 	},
// 	Description: {
// 		type: String,
// 		required: true,
// 	},
// 	Location: {
// 		type: { type: String, default: "Point" },
// 		coordinates: [Number],
// 	},
// });

// BusStopSchema.index({ Location: "2dsphere" });

// const BusStop = mongoose.model("busstop", BusStopSchema);

// export default BusStop;