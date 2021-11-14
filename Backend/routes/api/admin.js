const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const config = require("config");

router.get("/", (req, res) => {
	return res.status(200);
});

router.put("/UpdateBusStopList", auth, async (req, res) => {
    // Get all the bus stops from LTA
	let allBusStops = [];
	let arrayOfPromises = [];

	for (var pageSearched = 0; pageSearched < 11; pageSearched++) {
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
		.then((data) => {
			return res.status(200).json({
				msg: "Successfully updated bus stop list",
				data: allBusStops,
				length: allBusStops.length,
			});
		})
		.catch((err) => {
			return res
				.status(500)
				.json({ msg: "Server error", error: err.message });
		});

    // Update Mongoose DB with the data
    // const session = 
    try {
        
    } catch (err) {
        return res
            .status(500)
            .json({ msg: "Server error", error: err.message });
    }
});

module.exports = router;
