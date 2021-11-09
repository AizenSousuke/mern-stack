const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

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

		// Session
		const session = await UserModel.startSession();
		try {
			// Transaction
			session.startTransaction();

			// See if user exists
			let user = await UserModel.findOne({ email }).session(session);

			if (user) {
				session.endSession();
				return res.status(400).json({
					errors: [{ msg: "User already exists" }],
				});
			}

			// Get users gravatar
			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "mm",
			});

			user = new User({ name, email, avatar, password });

			// Encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save({ session });

			// Return jsonwebtoken (so user can log in straightaway)
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 3600 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
			session.commitTransaction();
			session.endSession();
		} catch (err) {
			console.error(err.message);
			session.abortTransaction();
			session.endSession();
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
