const express = require("express");
const router = express.Router();
const axios = require("axios");

const details = async (stop) => {
	const data = await axios.get(
		"http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2",
		{ headers: header, params: { BusStopCode: stop } }
	);
	return data;
};

module.exports = router;
