const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	UserId: {
		type: String,
		required: true,
		default: new mongoose.Types.ObjectId()
	},
	Name: {
		type: String,
		required: true,
	},
	Email: {
		type: String,
		required: true,
		unique: true,
	},
	Password: {
		type: String,
	},
	Avatar: {
		type: String,
		default: null,
	},
	IsAdmin: {
		type: Boolean,
		required: false,
		default: false,
	},
	DateModified: {
		type: Date,
		default: Date.now,
	},
});

// Export as User
module.exports = User = mongoose.model("user", UserSchema);
