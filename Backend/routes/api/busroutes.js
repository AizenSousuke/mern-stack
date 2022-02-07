const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const auth = require("../../middleware/auth");
const BusRoutes = require("../../models/BusRoutes");
const mongoose = require("mongoose");

const header = {
	Accept: "application/json",
	AccountKey: config.get("LTADataMallAPI"),
};

const getBusRoutes = async () => {
	const res = await axios.get(
		"http://datamall2.mytransport.sg/ltaodataservice/BusRoutes",
		{ headers: header }
	);
	return res.data;
};

router.get("/", auth, (req, res) => {
	try {
		if (!req.user.IsAdmin) {
			console.warn("Is not an admin");
			res.status(401).json({
				msg: "You are not allowed to access this endpoint. Please login as admin.",
			});
		}

		console.log("Is admin");
		getBusRoutes()
			.then(async (data) => {
				// Save the routes to mongo and contra them
				const session = await mongoose.startSession();
				try {
					session.startTransaction();
					console.log("Length of transaction: " + data.value.length);

					// Drop table
					// await BusRoutes.deleteMany({}).session(session);

					for (const service of data.value) {
						// Only update\add if there are missing items
						await BusRoutes.findOneAndUpdate(
							{
								ServiceNo: service.ServiceNo,
								Operator: service.Operator,
								Direction: service.Direction,
								StopSequence: service.StopSequence,
								BusStopCode: service.BusStopCode,
								Distance: service.Distance,
							},
							{
								ServiceNo: service.ServiceNo,
								Operator: service.Operator,
								Direction: service.Direction,
								StopSequence: service.StopSequence,
								BusStopCode: service.BusStopCode,
								Distance: service.Distance,
								WD_FirstBus: service.WD_FirstBus,
								WD_LastBus: service.WD_LastBus,
								SAT_FirstBus: service.SAT_FirstBus,
								SAT_LastBus: service.SAT_LastBus,
								SUN_FirstBus: service.SUN_FirstBus,
								SUN_LastBus: service.SUN_LastBus,
							},
							{ upsert: true }
						).session(session);
					}

					await session.commitTransaction();
					await session.endSession();

					return res.status(200).json({
						msg: "Successfully updated bus stop routes",
					});
				} catch (error) {
					await session.abortTransaction();
					await session.endSession();
					return res
						.status(500)
						.json({ msg: "Server error", error: error.message });
				}
			})
			.catch((error) => {
				console.error("Error in getBusRoutes: " + error);
				return res
					.status(500)
					.json({ msg: "Server error", error: error.message });
			});
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server error");
	}
});

// Export the module to be used in the main server js
module.exports = router;
