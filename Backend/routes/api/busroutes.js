const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const auth = require("../../middleware/auth");
const BusRoutes = require("../../models/BusRoutes");
const mongoose = require("mongoose");
const { CatchError } = require("../../util/ErrorUtil");

const header = {
	Accept: "application/json",
	AccountKey: config.get("LTADataMallAPI"),
};

const getBusRoutes = async (skip = null) => {
	const res = await axios.get(
		"http://datamall2.mytransport.sg/ltaodataservice/BusRoutes",
		{ headers: header, params: { $skip: skip } }
	);
	return res.data;
};

router.get("/", async (req, res) => {
	try {
		const routes = await BusRoutes.find({});
		if (!routes) {
			return res.status(404).json({ msg: "No routes found" });
		}

		return res.status(200).json({ routes: routes });
	} catch (error) {
		CatchError(error, res);
	}
});

router.get("/:serviceNo", async (req, res) => {
	try {
		if (!req.params.serviceNo) {
			return res.status(422).json({ msg: "No serviceNo param found" });
		}

		const routes = await BusRoutes.find({
			ServiceNo: req.params.serviceNo,
		});
		if (!routes) {
			return res.status(404).json({ msg: "No routes found" });
		}

		return res.status(200).json({ routes: routes });
	} catch (error) {
		CatchError(error, res);
	}
});

router.post("/update", auth, async (req, res) => {
	try {
		if (!req.user.IsAdmin) {
			console.warn("Is not an admin");
			res.status(401).json({
				msg: "You are not allowed to access this endpoint. Please login as admin.",
			});
		}

		console.log("Is admin");

		let anyMoreDataToParse = true;
		let skip = 0;
		let skipBy = 500;
		while (anyMoreDataToParse) {
			console.log("Getting bus routes at skip: " + skip);
			// Check if there are bus routes in the next step
			await getBusRoutes(skip)
			.then(async (data) => {
				// Save the routes to mongo and contra them
				const session = await mongoose.startSession();
				try {
					session.startTransaction();
					console.log("Length of transaction: " + data.value.length);

					// Drop table
					// await BusRoutes.deleteMany({}).session(session);

					// If there are no more data, break out 
					if (data.value.length == 0) {
						anyMoreDataToParse = false;
						console.log("Finish getting data at skip: " + skip);
					}

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

					skip += skipBy;
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
		}

		return res.status(200).json({
			msg: "Successfully updated bus stop routes",
		});

		// getBusRoutes()
		// 	.then(async (data) => {
		// 		// Save the routes to mongo and contra them
		// 		const session = await mongoose.startSession();
		// 		try {
		// 			session.startTransaction();
		// 			console.log("Length of transaction: " + data.value.length);

		// 			// Drop table
		// 			// await BusRoutes.deleteMany({}).session(session);

		// 			for (const service of data.value) {
		// 				// Only update\add if there are missing items
		// 				await BusRoutes.findOneAndUpdate(
		// 					{
		// 						ServiceNo: service.ServiceNo,
		// 						Operator: service.Operator,
		// 						Direction: service.Direction,
		// 						StopSequence: service.StopSequence,
		// 						BusStopCode: service.BusStopCode,
		// 						Distance: service.Distance,
		// 					},
		// 					{
		// 						ServiceNo: service.ServiceNo,
		// 						Operator: service.Operator,
		// 						Direction: service.Direction,
		// 						StopSequence: service.StopSequence,
		// 						BusStopCode: service.BusStopCode,
		// 						Distance: service.Distance,
		// 						WD_FirstBus: service.WD_FirstBus,
		// 						WD_LastBus: service.WD_LastBus,
		// 						SAT_FirstBus: service.SAT_FirstBus,
		// 						SAT_LastBus: service.SAT_LastBus,
		// 						SUN_FirstBus: service.SUN_FirstBus,
		// 						SUN_LastBus: service.SUN_LastBus,
		// 					},
		// 					{ upsert: true }
		// 				).session(session);
		// 			}

		// 			await session.commitTransaction();
		// 			await session.endSession();

		// 			return res.status(200).json({
		// 				msg: "Successfully updated bus stop routes",
		// 			});
		// 		} catch (error) {
		// 			await session.abortTransaction();
		// 			await session.endSession();
		// 			return res
		// 				.status(500)
		// 				.json({ msg: "Server error", error: error.message });
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.error("Error in getBusRoutes: " + error);
		// 		return res
		// 			.status(500)
		// 			.json({ msg: "Server error", error: error.message });
		// 	});
	} catch (error) {
		CatchError(error, res);
	}
});

// Export the module to be used in the main server js
module.exports = router;
