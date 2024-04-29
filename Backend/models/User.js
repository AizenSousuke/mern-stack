const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	UserId: {
		type: mongoose.Types.ObjectId,
		required: true,
		default: new mongoose.Types.ObjectId()
	},
	// For facebook\google ids
	SocialId: {
		type: String,
		default: null
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
	Token: {
		type: String,
		required: false,
		default: null
	},
	RefreshToken: {
		type: String,
		required: false,
		default: null
	},
	TokenExpiryDate: {
		type: Date,
		required: false,
		default: null
	},
	DateModified: {
		type: Date,
		default: Date.now,
	},
});

// Export as User
module.exports = User = mongoose.model("user", UserSchema);
