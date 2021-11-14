const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const config = require("config");
const BusStop = require("../../models/BusStop");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
	return res.status(200);
});

router.put("/UpdateBusStopList", auth, async (req, res) => {
	// Get all the bus stops from LTA
	let allBusStops = [];
	let arrayOfPromises = [];

	for (var pageSearched = 0; pageSearched < 1; pageSearched++) {
		arrayOfPromises.push(
			await axios
				.get(
					"http://datamall2.mytransport.sg/ltaodataservice/BusStops",
					{
						headers: { AccountKey: config.get("LTADataMallAPI") },
						params: {
							$skip: pageSearched * 500,
						},
					}
				)
				.then((response) => {
					response.data.value.map((stops) => {
						allBusStops.push(stops);
					});
				})
				.catch((err) => {
					return res.status(500).json({ error: err.message });
				})
		);
	}

	Promise.all(arrayOfPromises)
		.then(async (data) => {
			// Update Mongoose DB with the data
			const session = await mongoose.startSession();
			try {
				session.startTransaction();

				// Drop the whole table first
				await BusStop.deleteMany({}).session(session);

				for (const stop of allBusStops) {
					await BusStop.findOneAndUpdate(
						{
							BusStopCode: stop.BusStopCode,
						},
						{
							RoadName: stop.RoadName,
							Description: stop.Description,
							Latitude: stop.Latitude,
							Longitude: stop.Longitude,
						},
						{ upsert: true }
					).session(session);
				}

				await session.commitTransaction();
				await session.endSession();

				return res.status(200).json({
					msg: "Successfully updated bus stop list",
					length: allBusStops.length,
				});
			} catch (err) {
				await session.abortTransaction();
				await session.endSession();
				return res
					.status(500)
					.json({ msg: "Server error", error: err.message });
			}
		})
		.catch((err) => {
			return res
				.status(500)
				.json({ msg: "Server error", error: err.message });
		});
});

module.exports = router;
