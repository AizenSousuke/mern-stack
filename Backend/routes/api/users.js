const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const UserModel = require("../../models/User");

router.get("/", (req, res) => {
	res.send("Users route");
});

router.post(
	"/",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			// See if user exists
			let user = await UserModel.findOne({ email });

			if (user) {
				res.status(400).json({
					errors: [{ msg: "User already exists" }],
				});
			}

			// Get users gravatar
			const avatar = gravatar.url(email, {
				s: "2",
				r: "pg",
				d: "mm",
			});

			user = new User({ name, email, avatar, password });

			// Encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			// Return jsonwebtoken (so user can log in straightaway)

			res.send("User registered");
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
