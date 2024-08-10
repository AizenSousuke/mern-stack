// The express server
import express from "express";
const app = express();
const PORT = process.env.PORT || 8080;
import { connectDB } from "./db";
import cors from "cors";
import config from "config";
import UserModel from "./models/User.js";
import session from "express-session";
import cookieParser from "cookie-parser";

// Add self signed key for https
// const https = require("https");
// const fs = require("fs");
// var key = fs.readFileSync(__dirname + "/config/selfsigned.key");
// var cert = fs.readFileSync(__dirname + "/config/selfsigned.crt");
// var options = {
// 	key: key,
// 	cert: cert,
// };

// Passport
import passport from "passport";
const FacebookStrategy = require("passport-facebook").Strategy;

if (process.env.NODE_ENV !== "test") {
	// To get HTTPS
	// var server = https.createServer(options, app);
	// server.listen(PORT, (error, result) => {
	// 	console.log(`HTTPS Server started on port ${PORT}`);
	// });

	// Normal way to get http
	app.listen(PORT, () => {
		console.log("Listening on port %s", PORT);
	});
}

// Connect Database
connectDB();

// Adds middlewares
// Add body-parser middleware
app.use(express.json());
app.use(
	session({
		secret: process.env.jwtSecret ?? config.get("jwtSecret"),
		saveUninitialized: false,
		resave: false,
	})
);
app.use(cookieParser());

// Add CORS
app.use(cors());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID ?? config.FACEBOOK_APP_ID,
			clientSecret:
				process.env.FACEBOOK_APP_SECRET ?? config.FACEBOOK_APP_SECRET,
			callbackURL:
				process.env.FACEBOOK_CALLBACK_URL ??
				config.FACEBOOK_CALLBACK_URL,
			profileFields: ["id", "emails", "name"],
		},
		async (accessToken, refreshToken, profile, cb) => {
			// Save the accessToken and refreshToken if you need to call facebook apis later on
			console.log("Profile: " + JSON.stringify(profile));
			console.log("Access Token: " + accessToken);
			// FB does not provide refresh token. So it should be undefined.
			console.log("Refresh Token: " + refreshToken);
			const user = await UserModel.findOne({
				Email: profile.emails[0].value,
				SocialId: profile.id,
			}).select("-Password");
			if (!user) {
				var date = new Date(Date.now());
				var expiryDate = date.setDate(
					date.getDate() +
					(process.env.TOKEN_EXPIRY_DAYS ??
						config.get("TOKEN_EXPIRY_DAYS"))
				);
				const newUser = new UserModel({
					// Add social id
					SocialId: profile.id,
					Name: profile.name.givenName,
					Email: profile.emails[0].value,
					Token: accessToken,
					RefreshToken: refreshToken,
					TokenExpiryDate: expiryDate,
				});

				await newUser.save();

				const user = await UserModel.findOne({
					Email: profile.emails[0].value,
				}).select("-Password");
				return cb(null, user);
			} else {
				// Save new accessToken
				user.Token = accessToken;
				user.RefreshToken = refreshToken;
				var date = new Date(Date.now());
				var expiryDate = date.setDate(
					date.getDate() +
					(process.env.TOKEN_EXPIRY_DAYS ??
						config.get("TOKEN_EXPIRY_DAYS"))
				);
				user.TokenExpiryDate = expiryDate;
				await user.save();
				return cb(null, user);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	// Return user from mongoose database
	UserModel.findById(user.UserId, null, null, (error, user) => {
		done(error, user);
	});
});

// Define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/busstops", require("./routes/api/busstops"));
app.use("/api/busroutes", require("./routes/api/busroutes"));
app.use("/api/busservices", require("./routes/api/busservices"));
app.use("/api/bus", require("./routes/api/bus"));
app.use("/api/settings", require("./routes/api/settings"));
app.use("/api/admin", require("./routes/api/admin"));

app.get("/", (req, res) => {
	res.send(`Server is on port ${PORT}`);
});

module.exports = app;
