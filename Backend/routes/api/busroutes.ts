import express, { response } from "express";
const router = express.Router();
import axios from "axios";
import config from "config";
import auth from "../../middleware/auth";
import Util from "../../util/Util";
const BusRoutes = require("../../models/DataMall/BusRoutes").default;
const { CatchError } = require("../../util/ErrorUtil").default;

const header = {
	Accept: "application/json",
	AccountKey: process.env.LTADataMallAPI ?? config.get("LTADataMallAPI"),
};

router.get("/:serviceNo/:busStopCode", async (req: any, res) => {
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

router.get("/:serviceNo", async (req: any, res) => {
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
			{
				$sort: {
					Direction: 1,
					StopSequence: 1,
				},
			},
			{
				$group: {
					_id: "$Direction",
					towards: {
						$last: "$BusStopData.Description"
					},
					direction: {
						$addToSet: {
							_id: "$_id",
							BusStopCode: "$BusStopCode",
							Direction: "$Direction",
							Distance: "$Distance",
							Operator: "$Operator",
							ServiceNo: "$ServiceNo",
							StopSequence: "$StopSequence",
							SAT_FirstBus: "$SAT_FirstBus",
							SAT_LastBus: "$SAT_LastBus",
							SUN_FirstBus: "$SUN_FirstBus",
							SUN_LastBus: "$SUN_LastBus",
							WD_FirstBus: "$WD_FirstBus",
							WD_LastBus: "$WD_LastBus",
							__v: "$__v",
							BusStopData: "$BusStopData",
						},
					},
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

// router.post("/update", auth, async (req: any, res) => {
// 	try {
// 		if (!req.user.IsAdmin) {
// 			console.warn("Is not an admin");
// 			res.status(401).json({
// 				msg: "You are not allowed to access this endpoint. Please login as admin.",
// 			});
// 		}

// 		console.log("Is admin");

// 		await getPromisesForAllBusRoutesFromLTADataMallAPI(res);

// 		return res.status(200).json({
// 			msg: "Successfully updated bus stop routes",
// 		});
// 	} catch (error) {
// 		CatchError(error, res);
// 	}
// });

router.get("/", async (req: any, res) => {
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

/**
 * Bus Routes
 */
export default router;

export async function getPromisesForAllBusRoutesFromLTADataMallAPI(res) {
	let arrayOfBusRoutes = [];
	let allBusRoutesCount = 0;
	let anyMoreDataToParse = true;
	let skip = 0;
	let skipBy = 500;

	while (anyMoreDataToParse) {
		await Util.delay(1000);

		await axios
			.get(
				"http://datamall2.mytransport.sg/ltaodataservice/BusRoutes",
				{ headers: header, params: { $skip: skip } }
			)
			.then(async (response) => {
				if (response.data.value.length == 0) {
					anyMoreDataToParse = false;
					console.log("Finish getting data at skip: " + skip);
				}

				console.log("response length from datamall api: ", response.data.value.length, "skip:", skip);
				allBusRoutesCount += response.data.value.length;
				response.data.value.map(busRoutes => {
					arrayOfBusRoutes.push(busRoutes);
				});

				return response.data.value;
			})
			.catch((error) => {
				console.error(error.message);
				return [];
			});

		skip += skipBy;
	}

	return { arrayOfBusRoutes, allBusRoutesCount };
}

