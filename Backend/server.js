// The express server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("Listening on port %s", PORT);
});

app.get('/', (req, res) => {
    res.send(`Server is on port ${PORT}`);
});
