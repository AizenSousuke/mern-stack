const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.put("/updateBusStopList", auth, async (req, res) => {});

module.exports = router;
