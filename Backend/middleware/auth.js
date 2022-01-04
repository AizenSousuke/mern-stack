const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports = async (req, res, next) => {
	console.log("Running middleware");
	try {
		// Get token from headers
		const token = req.header("X-Auth-Token");
		console.log("Token in req header: " + JSON.stringify(token));

		// Check if no token is provided
		if (!token) {
			console.log("No token was provided in x-auth-token header.");

			return res
				.status(401)
				.json({ msg: "No token provided. Authorization denied." });
		}

		// Get user whose token match in mongo
		const user = await User.findOne({ Token: token }).select("-Password");
		if (user) {
			// Check token has not expired
			if (user.TokenExpiryDate > Date.now()) {
				console.log("Setting request user");
				req.user = user;
				return next();
			}
			// If expired, get new token by redirecting user to login page
			console.warn("Expired token");
			return res.redirect("/auth/facebook");
		}
		return res
			.status(500)
			.json({ msg: "There is some issue with the request." });
	} catch (err) {
		return res
			.status(401)
			.json({ msg: "Token is not valid. " + err.message });
	}

	// Verify token
	// try {
	// 	const decoded = jwt.verify(token, config.get("jwtSecret"));
	// 	req.user = decoded.user;
	// 	next();
	// } catch (err) {
	// 	return res.status(401).json({ msg: "Token is not valid" });
	// }
};
