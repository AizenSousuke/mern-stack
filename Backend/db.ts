const mongoose = require("mongoose");
const configuration = require("config");
const db = process.env.mongoURI ?? configuration.get("mongoURI");

export const connectDB = async () => {
	try {
		await mongoose.connect(db);
		console.log("MongoDB Connected...");
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};
