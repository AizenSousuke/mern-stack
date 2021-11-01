// The express server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
app.listen(PORT, () => {
	console.log("Listening on port %s", PORT);
});

// Connect Database
connectDB();

// Adds middlewares

app.get('/', (req, res) => {
    res.send(`Server is on port ${PORT}`);
});
