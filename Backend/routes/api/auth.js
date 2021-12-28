const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const UserModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const https = require("https");
const auth = require("../../middleware/auth");

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
	}),
	(req, res) => {
		console.log(
			"Req user from facebook callback: " + JSON.stringify(req.user)
		);
		console.log(
			"Req isAuthenticated from facebook callback: " +
				req.isAuthenticated()
		);
		return res.status(302).redirect(
			// Redirect back to app
			config.FRONTEND_LINK + `?token=${req.user.FacebookToken}`
		);
	}
);

router.get("/facebook/checkToken", auth, (req, res) => {
	// If there is a req.user
	console.log("Hitting facebook/login");
	console.log(JSON.stringify(req.user));
	return res.status(200).json({ data: req.isAuthenticated() });
});

router.get("/logout", (req, res) => {
	req.logout();
	res.status(200).json(true);
});

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
				{ expiresIn: 36000000 },
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
