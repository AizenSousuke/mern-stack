const express = require("express");
const router = express.Router();
const BusStop = require("../../models/BusStop");
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const config = require("config");

const header = {
	Accept: "application/json",
	AccountKey: config.get("LTADataMallAPI"),
};

const getBusStopDetails = async (stop) => {
	const res = await axios.get(
		"http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2",
		{ headers: header, params: { BusStopCode: stop } }
	);
	return res.data;
};

router.get("/", async (req, res) => {
	try {
		let code = req.query.code;
		if (!code) {
			return res.status(422).json({ msg: "Please add a query for code" });
		}

		let busStop;
		busStop = await BusStop.findOne({ BusStopCode: code });
		if (busStop == null) {
			return res
				.status(404)
				.json({ msg: "No bus stop with that code found" });
		}

		return res.status(200).json({ busStop: busStop });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server error");
	}
});

router.get("/search", async (req, res) => {
	try {
		if (!req.query.term) {
			return res
				.status(422)
				.json({ msg: "Must include a term parameter" });
		}

		let term = req.query.term.toString();
		if (!term) {
			return res
				.status(422)
				.json({ msg: "Must include a term parameter" });
		}

		let busStops = [];
		busStops = await BusStop.find({
			$or: [
				{ Description: { $regex: term, $options: "i" } },
				{ RoadName: { $regex: term, $options: "i" } },
				{ BusStopCode: { $regex: term, $options: "i" } },
			],
		});

		if (busStops) {
			return res.status(200).json({
				msg: `Successfully searched and found ${busStops.length} bus stops`,
				details: busStops,
			});
		}

		return res.status(404).json({ msg: "No bus stops found" });
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ msg: "Server Error" });
	}
});

router.get("/:code", async (req, res) => {
	try {
		const code = req.params.code;
		if (!code) {
			return res.status(422).json({ msg: "No bus stop code provided" });
		}

		const details = await getBusStopDetails(code);

		return res.status(200).json({ data: details });
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ msg: "Server Error" });
	}
});

router.get("/nearest", async (req, res) => {
	try {
		if (!req.query.latitude || !req.query.longitude) {
			return res
				.status(422)
				.json({ msg: "Must provide both latitude and longitude" });
		}

		// Search for bus stops nearby
		// TODO: https://docs.mongodb.com/manual/reference/operator/query/near/#mongodb-query-op.-near
		const busStopsNearby = await BusStop.find({
			Location: [req.query.longitude, req.query.latitude],
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ msg: "Server Error" });
	}
});

router.post(
	"/",
	[
		// Validators
		check("BusStopCode", "Bus Stop Code is required").not().isEmpty(),
		check("RoadName", "Road Name is required").not().isEmpty(),
		check("Description", "Description is required").not().isEmpty(),
		check("Longitude", "Longitude is required").not().isEmpty(),
		check("Latitude", "Latitude is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			BusStopCode,
			RoadName,
			Description,
			Longitude = 0,
			Latitude = 0,
		} = req.body;

		try {
			const busStop = await BusStop.find({
				BusStopCode: BusStopCode,
			}).exec();

			if (busStop.length > 0) {
				return res.status(400).json({
					errors: [
						{
							msg: "Bus Stop already exists",
							busStopCode: BusStopCode,
						},
					],
				});
			}

			let newBusStop = new BusStop({
				BusStopCode,
				RoadName,
				Description,
				Longitude,
				Latitude,
			});

			await newBusStop.save();

			res.send("Created Bus Stop");
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ msg: "Server Error" });
		}
	}
);

// Export the module to be used in the main server js
module.exports = router;
