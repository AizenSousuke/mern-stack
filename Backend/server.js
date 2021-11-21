// The express server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("config");
const UserModel = require("./models/User");

// Passport 
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
	new FacebookStrategy(
		{
			clientID: config.FACEBOOK_APP_ID,
			clientSecret: config.FACEBOOK_APP_SECRET,
			callbackURL: config.FACEBOOK_CALLBACK_URL,
			profileFields: ["id", "emails", "name"],
		},
		async (accessToken, refreshToken, profile, cb) => {
			// console.log("Profile: " + JSON.stringify(profile));
			const user = await UserModel.findOne({
				email: profile.emails[0].value,
			});
			if (!user) {
				const newUser = new User({
					userid: profile.id,
					name: profile.name.givenName,
					email: profile.emails[0].value,
				});

				await newUser.save();
				return cb(null, newUser);
			} else {
				return cb(null, user);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, { id: user.id, name: user.name, email: user.email });
});


app.listen(PORT, () => {
	console.log("Listening on port %s", PORT);
});

// Connect Database
connectDB();

// Adds middlewares
// Add body-parser middleware
app.use(express.json({ extended: false }));
app.use(passport.initialize("facebook"));

// Add CORS
app.use(cors());

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/busstops", require("./routes/api/busstops"));
app.use("/api/bus", require("./routes/api/bus"));
app.use("/api/settings", require("./routes/api/settings"));
app.use("/api/admin", require("./routes/api/admin"));

app.get("/", (req, res) => {
	res.send(`Server is on port ${PORT}`);
});
