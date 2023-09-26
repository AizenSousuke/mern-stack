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
	try {
		const user = await UserModel.find({}).catch((error) => {
			return res.status(404).json({ msg: "No user found", error: error });
		});
		return res
			.status(200)
			.json({ msg: "Successfully got the user", user: user });
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ msg: "Server error" });
	}
});

router.post(
	"/",
	[
		check("Name", "Name is required").not().isEmpty(),
		check("Email", "Please include a valid email").isEmail(),
		check(
			"Password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { Name, Email, Password } = req.body;

		// Session
		const session = await UserModel.startSession();
		// Transaction
		session.startTransaction();
		try {
			// See if user exists
			let user = await UserModel.findOne({ Email }).session(session);

			if (user) {
				await session.endSession();
				return res.status(400).json({
					errors: [{ msg: "User already exists" }],
				});
			}

			// Get users gravatar
			const Avatar = gravatar.url(Email, {
				s: "200",
				r: "pg",
				d: "mm",
			});

			user = new User({ Name, Email, Avatar, Password });

			// Encrypt password
			const salt = await bcrypt.genSalt(10);
			user.Password = await bcrypt.hash(Password, salt);
			await user.save({ session });

			// Return jsonwebtoken (so user can log in straightaway)
			const payload = {
				user: {
					id: user.UserId,
				},
			};

			jwt.sign(
				payload,
				process.env.jwtSecret ?? config.get("jwtSecret"),
				{ expiresIn: 3600000 },
				(error, token) => {
					if (error) throw err;
					res.json({ token });
				}
			);
			await session.commitTransaction();
			await session.endSession();
		} catch (error) {
			console.error(error.message);
			await session.abortTransaction();
			await session.endSession();
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

router.delete("/", async (req, res) => {
	const Email = req.query.Email;

	if (!email) {
		res.status(422).json({ err: "Invalid email address" });
	}

	// Session
	const session = await UserModel.startSession();
	try {
		// Transaction
		session.startTransaction();

		let user = await UserModel.findOne({ Email: Email }).session(session);

		if (!user) {
			await session.endSession();
			return res.status(404).json({ msg: "User not found" });
		}

		await user.remove({ session });

		await session.commitTransaction();
		await session.endSession();
		return res
			.status(200)
			.json({ msg: `Removed user with email: ${Email}` });
	} catch (error) {
		console.error(error.message);
		await session.abortTransaction();
		await session.endSession();
		return res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
