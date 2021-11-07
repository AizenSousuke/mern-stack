const express = require('express');
const router = express.Router();

// @route GET api/busstops
// @desc Bus Stop Route
// @access Public
router.get('/', (req, res) => {
    // Gets all the bus stops
    res.send("Bus Stops Route");
});


// Export the module to be used in the main server js
module.exports = router;