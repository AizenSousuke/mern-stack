const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const config = require("config");
const BusStop = require("../../models/BusStop");
const User = require("../../models/User");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

router.get("/", (req, res) => {
	return res.status(200);
});

router.put("/UpdateBusStopList", auth, async (req, res) => {
	// Check if logged in user is an admin
	// Note that auth does not update when admin flag is set in db manually
	console.log("User is admin: " + req.user.IsAdmin);
	if (req.user.IsAdmin) {
		// Get all the bus stops from LTA
		let allBusStops = [];
		let arrayOfPromises = [];

		for (var pageSearched = 0; pageSearched < 11; pageSearched++) {
			arrayOfPromises.push(
				await axios
					.get(
						"http://datamall2.mytransport.sg/ltaodataservice/BusStops",
						{
							headers: {
								AccountKey: config.get("LTADataMallAPI"),
							},
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
	} else {
		return res.status(403).json({ msg: "You must be an admin to do this" });
	}
});

router.patch(
	"/setAdmin",
	[
		check(
			"Email",
			"Please provide the email address of the user that you want to set an admin as"
		).isEmail(),
		check("IsAdmin", "Please set true or false").isBoolean(),
	],
	auth,
	async (req, res) => {
		try {
			const user = req.user;
			if (!user.IsAdmin) {
				return res
					.status(403)
					.json({ msg: "You must be an admin to do this" });
			}
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ msg: errors.array() });
			}
			const { Email, IsAdmin } = req.body;
			const updatedUser = await User.findOneAndUpdate(
				{ Email: Email },
				{ IsAdmin: IsAdmin }
			);
			if (!updatedUser) {
				return res.status(404).json({ msg: "No user found" });
			}

			return res.status(200).json({ msg: "Successfully set admin" });
		} catch (err) {}
	}
);

module.exports = router;
