import express from "express";
const router = express.Router();
import auth from "../../middleware/auth";
import axios from "axios";
import config from "config";
const BusStop = require("../../models/DataMall/BusStop").default;
const User = require("../../models/User").default;
import mongoose from "mongoose";
import { check, validationResult } from "express-validator";

router.get("/", async (req: any, res) => {
	return res.status(200).json({ msg: "Ok" });
});

/**
 * Admin endpoint for updating bus stop list
 */
router.put("/UpdateBusStopList", auth, async (req: any, res) => {
	// Check if logged in user is an admin
	// Note that auth does not update when admin flag is set in db manually
	console.log("User is admin: " + req.user.IsAdmin);
	if (req.user.IsAdmin) {
		console.log("Getting all bus stops from LTA");
		// Get all the bus stops from LTA
		let { arrayOfPromises, allBusStops } = await getPromisesForAllBusStopsFromLTADataMallAPI(res);

		Promise.all(arrayOfPromises)
			.then(async (data) => {
				console.log("Updating data in MongoDB");
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
								Location: [stop.Longitude, stop.Latitude],
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
				} catch (error) {
					await session.abortTransaction();
					await session.endSession();
					return res
						.status(500)
						.json({ msg: "Server error", error: error.message });
				}
			})
			.catch((error) => {
				return res
					.status(500)
					.json({ msg: "Server error", error: error.message });
			});
	} else {
		return res.status(403).json({ msg: "You must be an admin to do this" });
	}
});

/**
 * Admin endpoint to set a user as admin using an email address
 */
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
	async (req: any, res) => {
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

			return res.status(200).json({ msg: "Successfully set admin to " + IsAdmin });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ msg: "Something went wrong." });
		}
	}
);

export default router;

export async function getPromisesForAllBusStopsFromLTADataMallAPI(res) {
	let allBusStops = [];
	let arrayOfPromises = [];

	for (var pageSearched = 0; pageSearched < 11; pageSearched++) {
		arrayOfPromises.push(
			await axios
				.get(
					"http://datamall2.mytransport.sg/ltaodataservice/BusStops",
					{
						headers: {
							AccountKey: process.env.LTADataMallAPI ?? config.get("LTADataMallAPI"),
						},
						params: {
							$skip: pageSearched * 500,
						},
					}
				)
				.then((response) => {
					console.log("Got response!");
					// console.log(response.data);
					response.data.value.map((stops) => {
						allBusStops.push(stops);
					});
				})
				.catch((error) => {
					console.error(error);
					return res.status(500).json({ error: error.message });
				})
		);
	}

	return { arrayOfPromises, allBusStops };
}

