const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const Settings = require("../../models/Settings");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const isLoggedIn = require("../../middleware/isLoggedIn");

router.get("/", authMiddleware, async (req, res) => {
	try {
		console.log("Req user: " + JSON.stringify(req.user));
		const settings = await Settings.findOne({
			UserId: req.user.Id
		}).populate("UserId", "Name");
		// console.log("Settings: " + JSON.stringify(settings));

		if (!settings) {
			console.log("No settings");
			return res
				.status(404)
				.json({ msg: "There is no settings for this user" });
		}
		console.log("Successfully loaded settings");
		return res.status(200).json({
			msg: "Successfully loaded settings",
			settings: settings,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: "Server error" });
	}
});

router.put(
	"/",
	[check("settings", "Settings data structure is required").notEmpty()],
	authMiddleware,
	async (req, res) => {
		try {
			console.log("Body:" + JSON.stringify(req.body));
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(422).json({ msg: errors.array() });
			}

			const { settings } = req.body;

			// Create if it does not exist
			let UpdatedSettings = await Settings.findOneAndUpdate(
				{ UserId: req.user.Id },
				{ Settings: settings, DateUpdated: Date.now() },
				{ upsert: true, new: true, setDefaultsOnInsert: true }
			);

			return res.status(200).json({
				msg: `User settings has been updated at ${UpdatedSettings.DateUpdated}.`,
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

router.delete("/", authMiddleware, async (req, res) => {
	try {
		const user = req.user;
		let settings = await Settings.findOneAndDelete({ UserId: user.Id });
		if (!settings) {
			return res.status(404).json({ msg: "User settings not found" });
		}

		return res.status(200).json({ msg: "Successfully deleted settings" });
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
