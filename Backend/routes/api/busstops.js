const express = require("express");
const router = express.Router();
const BusStop = require("../../models/BusStop");
const { check, validationResult } = require("express-validator");

// @route GET api/busstops
// @desc Bus Stop Route
// @access Public
router.get("/", (req, res) => {
	// Gets all the bus stops
	const busStops = BusStop.find();
	res.send(busStops.Count);
});

router.post(
	"/",
	[
		// Validators
		check("BusStopCode", "Bus Stop Code is required").not().isEmpty(),
		check("RoadName", "Road Name is required").not().isEmpty(),
		check("Description", "Description is required").not().isEmpty(),
		// check("Longitude", "Longitude is required").not().isEmpty(),
		// check("Latitude", "Latitude is required").not().isEmpty(),
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
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error");
		}
	}
);

router.get("/:busStopCode", async (req, res) => {
	const busStopCode = req.params.busStopCode;
	try {
		const busStop = await BusStop.findOne({ BusStopCode: busStopCode });
		if (busStop == null) {
			return res
				.status(404)
				.json({ msg: "No bus stop with that code found" });
		}
		res.status(200).json(busStop);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Export the module to be used in the main server js
module.exports = router;
