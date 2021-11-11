const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");

// Using the auth middleware to check the json web token
router.get("/", authMiddleware, (req, res) => {
	res.send("Auth Route");
});

router.post("/signin", async (req, res) => {
	const { username, password } = req.body;
    console.log(username, password);
	res.status(200).json({ msg: username });
});

module.exports = router;
