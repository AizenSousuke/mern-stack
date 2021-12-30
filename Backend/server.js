// The express server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("config");
const UserModel = require("./models/User");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Add self signed key for https
const https = require("https");
const fs = require("fs");
var key = fs.readFileSync(__dirname + '/config/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/config/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

// Passport
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

// To get HTTPS
var server = https.createServer(options, app);
server.listen(PORT, (err, result) => {
	console.log(`HTTPS Server started on port ${PORT}`);
})

// Normal way to get http
// app.listen(PORT, () => {
// 	console.log("Listening on port %s", PORT);
// });

// Connect Database
connectDB();

// Adds middlewares
// Add body-parser middleware
app.use(express.json({ extended: false }));
app.use(
	session({
		secret: config.get("jwtSecret"),
		saveUninitialized: false,
		resave: false,
	})
);
app.use(cookieParser());

// Add CORS
// app.use(cors({
// 	credentials: true,
// 	origin: config.get("FRONTEND_LINK")
// }));
app.use(cors());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new FacebookStrategy(
		{
			clientID: config.FACEBOOK_APP_ID,
			clientSecret: config.FACEBOOK_APP_SECRET,
			callbackURL: config.FACEBOOK_CALLBACK_URL,
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
			}).select("-Password");
			if (!user) {
				var date = new Date(Date.now());
				var expiryDate = date.setDate(date.getDate() + config.get("TOKEN_EXPIRY_DAYS"));
				const newUser = new User({
					UserId: profile.id,
					Name: profile.name.givenName,
					Email: profile.emails[0].value,
					Token: accessToken,
					RefreshToken: refreshToken,
					TokenExpiryDate: expiryDate
				});

				await newUser.save();

				const user = await User.findOne({
					Email: profile.emails[0].value,
				}).select("-Password");
				return cb(null, user);
			} else {
				// Save new accessToken
				user.Token = accessToken;
				user.RefreshToken = refreshToken;
				var date = new Date(Date.now());
				var expiryDate = date.setDate(date.getDate() + config.get("TOKEN_EXPIRY_DAYS"));
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
	UserModel.findById(user.Id, null, null, (err, user) => {
		done(err, user);
	});
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