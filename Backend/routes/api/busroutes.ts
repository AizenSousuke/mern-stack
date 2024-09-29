import express, { response } from "express";
const router = express.Router();
import axios from "axios";
import config from "config";
import auth from "../../middleware/auth";
import Util from "../../util/Util";
import PrismaSingleton from "../../classes/PrismaSingleton";
const BusRoutes = require("../../models/DataMall/BusRoutes").default;
const { CatchError } = require("../../util/ErrorUtil").default;
const prisma = PrismaSingleton.getPrisma();

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

		const routes = await prisma.busRoute.findMany({
			where: {

				serviceNo: req.params.serviceNo,
			},
			orderBy: {
				distance: "asc"
			}
		});

		if (!routes) {
			return res
				.status(404)
				.json({ msg: "No routes or information provided" });
		}

		// Note: May return 2
		return res.status(200).json({
			routes: routes.filter(
				(service) => service.busStopCode === req.params.busStopCode
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

		const routes = await prisma.busRoute.aggregate({
			where: {
				serviceNo: req.params.serviceNo
			},
			orderBy: {
				distance: "asc"
			}
		});

		if (!routes) {
			return res.status(404).json({ msg: "No routes provided" });
		}

		return res.status(200).json({ routes: routes });
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
		const routes = await prisma.busRoute.findMany({});
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

