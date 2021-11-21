// The express server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("config");
const UserModel = require("./models/User");
const session = require("express-session");

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
			console.log("Profile: " + JSON.stringify(profile));
			const user = await UserModel.findOne({
				Email: profile.emails[0].value,
			}).select("-Password");
			if (!user) {
				const newUser = new User({
					UserId: profile.id,
					Name: profile.name.givenName,
					Email: profile.emails[0].value,
				});

				await newUser.save();

				const user = await User.findOne({Email: profile.emails[0].value}).select("-Password");
				console.log("User in facebook: " + JSON.stringify(user));
				return cb(null, user);
			} else {
				console.log("User in facebook 2: " + JSON.stringify(user));
				return cb(null, user);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, { Id: user._id, UserId: user.UserId, Name: user.Name, Email: user.Email });
});

app.listen(PORT, () => {
	console.log("Listening on port %s", PORT);
});

// Connect Database
connectDB();

// Adds middlewares
// Add body-parser middleware
app.use(express.json({ extended: false }));
app.use(session({ secret: config.get("jwtSecret"), saveUninitialized: false, resave: false }));
app.use(passport.initialize("facebook"));
app.use(passport.session());

// Add CORS
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
