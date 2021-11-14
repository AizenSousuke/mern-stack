const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Settings = require("../../models/Settings");
const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res) => {
	try {
		console.log(`User Id: ${req.user.id}`);
		const settings = await Settings.findOne({
			UserId: req.user.id,
		}).populate("UserId", "name");

		if (!settings) {
			return res
				.status(400)
				.json({ msg: "There is no settings for this user" });
		}

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
	[check("settings", "Settings Data Structure is required").notEmpty()],
	auth,
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(422).json({ msg: errors.array() });
			}

			const { settings } = req.body;

			// Create if it does not exist
			let UpdatedSettings = await Settings.findOneAndUpdate(
				{ UserId: req.user.id },
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

module.exports = router;
