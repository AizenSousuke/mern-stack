const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const UserModel = require("../../models/User");

router.get("/", async (req, res) => {
	const users = await UserModel.findOne({});
	return res.status(200).json({ msg: JSON.stringify(users) });
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
		// Transaction
		session.startTransaction();
		try {
			// See if user exists
			let user = await UserModel.findOne({ email }).session(session);

			if (user) {
				await session.endSession();
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
				{ expiresIn: 3600000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
			await session.commitTransaction();
			await session.endSession();
		} catch (err) {
			console.error(err.message);
			await session.abortTransaction();
			await session.endSession();
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

router.delete("/", async (req, res) => {
	const email = req.query.email;

	if (!email) {
		res.status(422).json({ err: "Invalid email address" });
	}

	// Session
	const session = await UserModel.startSession();
	try {
		// Transaction
		session.startTransaction();

		let user = await UserModel.findOne({ email: email }).session(session);

		if (!user) {
			await session.endSession();
			return res.status(404).json({ msg: "User not found" });
		}

		await user.remove({ session });

		await session.commitTransaction();
		await session.endSession();
		return res
			.status(200)
			.json({ msg: `Removed user with email: ${email}` });
	} catch (err) {
		console.error(err.message);
		await session.abortTransaction();
		await session.endSession();
		return res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
