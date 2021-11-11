const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
	// Get token from headers
	const token = req.header("x-auth-token");

	// Check if no token is provided
	if (!token) {
		return res
			.status(401)
			.json({ msg: "No token provided. Authorization denied." });
	}

	// Verify token
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));

		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};
