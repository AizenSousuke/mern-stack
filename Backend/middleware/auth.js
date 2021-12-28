const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
	console.log("Req isAuthenticated from auth middleware: " + req.isAuthenticated());
	console.log("Cookies: " + JSON.stringify(req.cookies));
	console.log("Signed Cookies: " + JSON.stringify(req.signedCookies));

	if (req.isAuthenticated()) {
		return next();
	}

	if (!req.user) {
		console.log("No facebook req.user user");
		return res.status(401).json({ msg: "No user" });
	}

	if (req.user) {
		// Facebook login
		next();
		return res.status(200);
	}

	// Get token from headers
	const token = req.header("x-auth-token");

	// Check if no token is provided
	if (!token) {
		console.log("No token");

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
		return res.status(401).json({ msg: "Token is not valid" });
	}
};
