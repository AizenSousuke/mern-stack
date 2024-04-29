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
const User = require("../../models/User");

// Using the auth middleware to check the json web token
router.get("/", authMiddleware, async (req, res) => {
	try {
		const user = await UserModel.findById(req.user.UserId).select(
			"-Password"
		);
		if (!user) {
			return res.status(401).json({ msg: "No user is logged in" });
		}

		return res.status(200).json({ msg: user });
	} catch (error) {
		console.log(error);
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
		req.session.save((error) => {
			const redirectURL =
				(process.env.FRONTEND_LINK ?? config.FRONTEND_LINK) +
				`?token=${req.user.Token}`;
			console.log("Redirecting to frontend link " + redirectURL);
			return res.status(302).redirect(
				// Redirect back to app
				redirectURL
			);
		});
	}
);

router.get("/checkTokenExpiry", async (req, res) => {
	console.log(
		"Checking Token Expiry for X-Auth-Token: " + req.header("X-Auth-Token")
	);
	if (!req.header("X-Auth-Token")) {
		return res
			.status(200)
			.json({ msg: "Token has expired", expired: true });
	}

	const user = await User.findOne({
		Token: req.header("X-Auth-Token"),
	}).select("-Password");
	if (!user) {
		return res.status(200).json({ msg: "Cannot find user", expired: true });
	}

	console.log("User with Token Expiry Date: " + user.TokenExpiryDate);
	const DateToday = new Date(Date.now());
	console.log("Date today: " + DateToday);
	const ExpiryDate = new Date(user.TokenExpiryDate);
	console.log("Expiry Date: " + ExpiryDate);
	if (DateToday > ExpiryDate) {
		console.log("Token has expired");
		return res
			.status(200)
			.json({ msg: "Token has expired", expired: true });
	}

	console.log("Token has not expired");
	return res
		.status(200)
		.json({ msg: "Token has not expired", expired: false });
});

router.get("/logout", (req, res) => {
	req.logout();
	res.status(200).json(true);
});

/**
 * Sign in with email and password then returns jwt_token
 */
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
					Id: user.UserId,
					IsAdmin: user.IsAdmin,
				},
			};

			const tokenExpiresIn = 36000000;

			jwt.sign(
				payload,
				process.env.jwtSecret ?? config.get("jwtSecret"),
				{ expiresIn: tokenExpiresIn },
				async (error, token) => {
					if (error) throw err;

					// Calculate the token expiration date
					const expirationDate = new Date();
					expirationDate.setSeconds(
						expirationDate.getSeconds() + tokenExpiresIn
					);

					// Save token to user entity in db
					await UserModel.updateOne(
						{
							Email: Email,
						},
						{
							Token: token,
							TokenExpiryDate: expirationDate,
							// No refresh token (TODO: Need to generate it above when creating the jwt token)
						}
					);

					return res.json({ token });
				}
			);

			console.log("Done signing in");
		} catch (error) {
			console.log(error);
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

module.exports = router;
