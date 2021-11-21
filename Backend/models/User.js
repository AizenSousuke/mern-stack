const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	userid: {
		type: String,
		required: true,
		default: new mongoose.Types.ObjectId()
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	avatar: {
		type: String,
		default: null,
	},
	isAdmin: {
		type: Boolean,
		required: false,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

// Export as User
module.exports = User = mongoose.model("user", UserSchema);
