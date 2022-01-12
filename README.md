# Yet Another SG Bus App
| | | |
|-|-|-|
| ![Image](https://i.imgur.com/vTFjIeU.png) | ![Image](https://i.imgur.com/WvHurAC.png) | ![Image](https://i.imgur.com/ev4KjpL.png) |


### SG Bus alternative application for my own use, without the ads. Created as a side project outside working hours to pursue a career as a ReactJS Developer. 


## Running the App
Ensure that the android emulator with expo installed is running already.
Open up terminal in the application's root directory and run the following commands:

Frontend
```
yarn frontend
```

Backend
```
yarn backend
```

# Deploying
```
To be updated once the architecture has been set up
```

# Devtools
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

## Todo:
- Add overlay settings page
- Clean code and set up unit tests
- Auth (Clear states i.e, Auth, Settings when logging out. Use local async storage settings instead to load\save settings and offer a way to update the settings on the server when logged in.)
- Settings (Update the date modified for any updates)
- Settings page
  - Force download\upload of json data
- Redux as state management
- Bus Alerts
- Bus Route modal
- Location Map
- Upload backend to Netlify\Azure
- Upload frontend to Netlify\APK
- Save all bus stops to database and set the last updated time
  - To compare the last updated time from the server\current time and if it is later than the one in DB, drop the db and repopulate it again based on the latest data. To use 1 week for now (update weekly).
  - Remember to update \ delta the data for any fixes since LTA might be wrong.
- User Login using Firebase Login
  - Store user data on their device (bus stop list and favourites)
- Save the startup page accordingly in db settings
- Location based bus stop search [Done]
- Use an online DB like Mongo DB to store data and retrieve data instead [Done]
  - Have a job on the db server to parse new data from LTA and massage it every week
  - Locally store user's data and cached data from Mongo