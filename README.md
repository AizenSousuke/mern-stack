# Yet Another SG Bus App
|                                           |                                           |                                           |
| ----------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| ![Image](https://i.imgur.com/vTFjIeU.png) | ![Image](https://i.imgur.com/WvHurAC.png) | ![Image](https://i.imgur.com/ev4KjpL.png) |


> ### SG Bus alternative android application for my own use, without the ads. Created as a side project outside working hours to pursue a career as a ReactJS (Mobile) Developer. 

---

# *Disclaimer*
```
All the data are derived from the LTA DataMall API. We apologize if there any  discrepancies in the data provided and we will try our best to fix it on our end or through a data patch as soon as possible. Live data is purely dependent on LTA's backend and we are not responsible for the accuracy or availability of the data. This

By using this application you agree to not held us responsible for your bus not arriving on time.
```

---

## Features
- Ads free application
- Easy to use GUI

---

## Screenshots
![Image](https://i.imgur.com/wv7KKv8.gif)

---

## Running the App

Config files to create:

Backend\db.js
```
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
	try {
		await mongoose.connect(db);
		console.log("MongoDB Connected...");
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;

```
\config\default.json <-- This file is for heroku to make sure that the application does not error out. It doesn't do anything as you get the settings from process.env.xxx in heroku config.
Backend\config\default.json
```
{
    "mongoURI" : "mongodb+srv://username:password@database01cluster.pqete.mongodb.net/database?retryWrites=true&w=majority",
    "jwtSecret" : "mysecrettoken",
    "LTADataMallAPI" : "",
    "FACEBOOK_APP_ID" : "",
    "FACEBOOK_APP_SECRET" : "",
    "FACEBOOK_CALLBACK_URL" : "http://localhost:8080/api/auth/facebook/callback",
    "FRONTEND_LINK" : "exp://<LOCAL_IP>:19000",
    "TOKEN_EXPIRY_DAYS" : 1,
    "MAX_DISTANCE_IN_METRES": 300
}
```
Backend\config\test.json
```
{}
```

Frontend\app.config.json
```
module.exports = () => {
	if (process.env.NODE_ENV === "production") {
		// Production
		return {
			extra: {
				TOKEN: "TOKEN",
				BACKEND_API: "",
				MAPBOX: "",
				MAX_DISTANCE_IN_METRES: 300,
			},
		};
	} else {
		// Development
		return {
			extra: {
				TOKEN: "TOKEN",
				BACKEND_API: "http://10.0.2.2:8080/api",
				MAPBOX: "",
				MAX_DISTANCE_IN_METRES: 300,
			},
		};
	}
};
```
Frontend\config\Emulator.bat
```
cd /d C:\Users\%username%\AppData\Local\Android\sdk\emulator
emulator @Pixel_4_API_30
```

<details>
<summary>Obsolete Step</summary>

Frontend\config\default.json
```
{
    "TOKEN": "TOKEN",
    "BACKEND_API": "http://10.0.2.2:8080/api",
    "MAPBOX": "<MAPBOX_API_KEY>",
    "MAX_DISTANCE_IN_METRES": 300
}
```
Frontend\config\test.json
```
{}
```
</details>

### Note
Ensure that the android emulator with expo installed is running already.
Open up terminal in the application's root directory and run the following commands:

## Frontend
```
yarn frontend
```

## Backend
```
yarn backend
```

---

# Deploying
```
To be updated once the architecture has been set up
```

# Devtools
Start dev tools using the command:
```
react-devtools
```

# If error
```
Uninstall react-native-elements and reinstalling them.
```

## Notes
Use
```
adb reverse tcp:8080 tcp:8080
```
for the frontend app to hit the backend server without 'Network Error'

Kill it with:
```
adb kill-server
```

To run emulator using a shortcut, open a notepad and paste the following:
```
cd /d C:\Users\%username%\AppData\Local\Android\sdk\emulator
emulator @Pixel_4_API_30
```
and save it as a batch file.

### Ongoing:
- Clean code and set up unit tests

## Todo:
- Bus Information page with First Bus, Last Bus and Bus Route 
  - Bus Route modal 
  - Information modal
  - Bus Location [Done]
- Add overlay settings page
- Auth (Clear states i.e, Auth, Settings when logging out. Use local async storage settings instead to load\save settings and offer a way to update the settings on the server when logged in.) [Done]
- Settings (Update the date modified for any updates)
- Settings page
  - Force download\upload of json data
- Redux as state management
- Bus Alerts
- Location Map [Done]
- Upload backend to Netlify\Azure\Heroku
- Upload frontend to Netlify\APK
- Save all bus stops to database and set the last updated time
  - To compare the last updated time from the server\current time and if it is later than the one in DB, drop the db and repopulate it again based on the latest data. To use 1 week for now (update weekly).
  - Remember to update \ delta the data for any fixes since LTA might be wrong.
- User Login using Passport JS and Mongo DB [Done]
  - Store user data on their device (bus stop list and favourites)
- Save the startup page accordingly in db settings
- Location based bus stop search [Done]
- Use an online DB like Mongo DB to store data and retrieve data instead [Done]
  - Have a job on the db server to parse new data from LTA and massage it every week
  - Locally store user's data and cached data from Mongo


## Known issues
- Facebook login doesn't work suddenly when using http. 
  - Fix is to change to https then back to http using the config json and server.js in backend.