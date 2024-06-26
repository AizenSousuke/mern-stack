const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const { CatchError } = require("../../util/ErrorUtil");

const header = {
	Accept: "application/json",
	AccountKey: process.env.LTADataMallAPI ?? config.get("LTADataMallAPI"),
};

const details = async (busStopCode, serviceNo = null) => {
	const res = await axios.get(
		"http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2",
		{
			headers: header,
			params: { BusStopCode: busStopCode, serviceNo: serviceNo },
		}
	);
	console.log(res.data);
	return res.data;
};

router.get("/details/:busStopCode/:serviceNo", async (req, res) => {
	try {
		console.log(req.params.busStopCode);
		console.log(req.params.serviceNo);
		// if (!req.params.busStopCode) {
		// 	return res.status(422).json({msg: "No bus stop code param provided"});
		// }
		const data = await details(
			req.params.busStopCode,
			req.params.serviceNo
		);

		return res.status(200).json({
			msg: "Succesfully get bus arrival time",
			data: data,
		});
	} catch (error) {
		CatchError(error, res);
	}
});

module.exports = router;
