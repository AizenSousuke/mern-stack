const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const UserModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const passport = require("passport");

// Using the auth middleware to check the json web token
router.get("/", authMiddleware, async (req, res) => {
	try {
		const user = await UserModel.findById(req.user.id).select("-Password");
		if (!user) {
			return res.status(401).json({ msg: "No user is logged in" });
		}

		return res.status(200).json({ msg: user });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Server error" });
	}
});

router.get(
	"/facebook",
	passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		scope: ["email"],
		failureRedirect: "/"
	}),
	(req, res) => {
		return res
			.status(200)
			.json({ msg: "Logged in to Facebook successfully" });
	}
);

router.post(
	"/signin",
	[
		check(
			"Email",
			"Email is required. Please enter a valid email."
		).isEmail(),
		check("Password", "Password is required").exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ msg: errors.array() });
			}

			const { Email, Password } = req.body;

			const user = await UserModel.findOne({
				Email: Email,
			});

			if (!user) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}

			const isMatch = await bcrypt.compare(Password, user.Password);

			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid Password" });
			}

			// Return jsonwebtoken (so user can log in straightaway)
			const payload = {
				user: {
					Id: user.id,
					IsAdmin: user.IsAdmin,
				},
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 3600 },
				(err, token) => {
					if (err) throw err;
					return res.json({ token });
				}
			);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

module.exports = router;
