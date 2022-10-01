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
	AccountKey: process.env.LTADataMallAPI ?? config.get("LTADataMallAPI"),
};

/**
 *
 * @param {number} skip Number of results to skip as the API ony allows 500 results to be displayed at maximum
 * @returns List of routes
 */
const getBusRoutes = async (skip = null) => {
	const res = await axios.get(
		"http://datamall2.mytransport.sg/ltaodataservice/BusRoutes",
		{ headers: header, params: { $skip: skip } }
	);
	return res.data;
};

router.get("/:serviceNo/:busStopCode", async (req, res) => {
	try {
		if (!req.params.serviceNo || !req.params.busStopCode) {
			return res
				.status(422)
				.json({ msg: "No serviceNo nor busStopCode param provided" });
		}

		const routes = await BusRoutes.find({
			ServiceNo: req.params.serviceNo,
		}).sort({ Distance: "asc" });

		if (!routes) {
			return res
				.status(404)
				.json({ msg: "No routes or information provided" });
		}

		// Note: May return 2
		return res.status(200).json({
			routes: routes.filter(
				(service) => service.BusStopCode === req.params.busStopCode
			),
		});
	} catch (error) {
		CatchError(error, res);
	}
});

router.get("/:serviceNo", async (req, res) => {
	try {
		if (!req.params.serviceNo) {
			return res.status(422).json({ msg: "No serviceNo param provided" });
		}

		const routesWithBusStopName = await BusRoutes.aggregate([
			{
				$match: {
					ServiceNo: req.params.serviceNo,
				},
			},
			{
				$lookup: {
					from: "busstops",
					localField: "BusStopCode",
					foreignField: "BusStopCode",
					as: "BusStopData",
				},
			},
		]);

		if (!routesWithBusStopName) {
			return res.status(404).json({ msg: "No routes provided" });
		}

		return res.status(200).json({ routes: routesWithBusStopName });
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

		// Using this method will result in Cannot set headers after they are sent to the client errors
		// let anyMoreDataToParse = true;
		// let skip = 0;
		// let skipBy = 500;
		// let dataToParse = [];
		// while (anyMoreDataToParse) {
		// 	console.log("Getting bus routes at skip: " + skip);
		// 	// Check if there are bus routes in the next step
		// 	await getBusRoutes(skip)
		// 		.then((data) => {
		// 			try {
		// 				console.log("Length of data: " + data.value.length);

		// 				// If there are no more data, break out
		// 				if (data.value.length == 0) {
		// 					anyMoreDataToParse = false;
		// 					console.log("Finish getting data at skip: " + skip);
		// 				}

		// 				data.value.forEach((item) => {
		// 					dataToParse.push(item);
		// 				});

		// 				skip += skipBy;
		// 			} catch (error) {
		// 				return res.status(500).json({
		// 					msg: "Server error",
		// 					error: error.message + " at skip:" + skip,
		// 				});
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			console.error("Error in getBusRoutes: " + error);
		// 			return res
		// 				.status(500)
		// 				.json({ msg: "Server error", error: error.message });
		// 		});
		// }

		// // Save the routes to mongo and contra them
		// const session = await mongoose.startSession();
		// try {
		// 	session.startTransaction();

		// 	for (const service of dataToParse) {
		// 		// Only update\add if there are missing items
		// 		await BusRoutes.findOneAndUpdate(
		// 			{
		// 				ServiceNo: service.ServiceNo,
		// 				Operator: service.Operator,
		// 				Direction: service.Direction,
		// 				StopSequence: service.StopSequence,
		// 				BusStopCode: service.BusStopCode,
		// 				Distance: service.Distance,
		// 			},
		// 			{
		// 				ServiceNo: service.ServiceNo,
		// 				Operator: service.Operator,
		// 				Direction: service.Direction,
		// 				StopSequence: service.StopSequence,
		// 				BusStopCode: service.BusStopCode,
		// 				Distance: service.Distance,
		// 				WD_FirstBus: service.WD_FirstBus,
		// 				WD_LastBus: service.WD_LastBus,
		// 				SAT_FirstBus: service.SAT_FirstBus,
		// 				SAT_LastBus: service.SAT_LastBus,
		// 				SUN_FirstBus: service.SUN_FirstBus,
		// 				SUN_LastBus: service.SUN_LastBus,
		// 			},
		// 			{ upsert: true }
		// 		).session(session);
		// 	}

		// 	await session.commitTransaction();
		// 	await session.endSession();
		// } catch (error) {
		// 	await session.abortTransaction();
		// 	await session.endSession();
		// 	CatchError(error, res);
		// }

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
						console.log(
							"Length of transaction: " + data.value.length
						);

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
						return res.status(500).json({
							msg: "Server error",
							error: error.message,
						});
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
	} catch (error) {
		CatchError(error, res);
	}
});

router.get("/", async (req, res) => {
	try {
		const routes = await BusRoutes.find({});
		if (!routes) {
			return res.status(404).json({ msg: "No routes provided" });
		}

		return res.status(200).json({ routes: routes });
	} catch (error) {
		CatchError(error, res);
	}
});

// Export the module to be used in the main server js
module.exports = router;
