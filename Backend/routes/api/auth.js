const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const UserModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// Using the auth middleware to check the json web token
router.get("/", authMiddleware, async (req, res) => {
	try {
		const user = await UserModel.findById(req.user.id).select("-password");
		res.status(200).json({ msg: user });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Server error" });
	}
});

router.post(
	"/signin",
	[
		check("email", "Email is required. Please enter a valid email.").isEmail(),
		check("password", "Password is required").exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ msg: errors.array() });
			}

			const { email, password } = req.body;

			const user = await UserModel.findOne({
				email: email,
			});

			if (!user) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid Password" });
			}
			// Return jsonwebtoken (so user can log in straightaway)
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 3600000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: "Server error" });
		}
	}
);

module.exports = router;
