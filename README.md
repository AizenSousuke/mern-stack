# Mern App
SG Bus alternative application for my own use, without the ads. Created as a side project outside working hours to pursue a career as a ReactJS Developer. 

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

## Todo:
- Auth (Clear states i.e, Auth, Settings when logging out. Use local async storage settings instead to load\save settings and offer a way to update the settings on the server when logged in.)
- Settings (Update the date modified for any updates)
- Settings page
  - Force download\upload of json data
- Redux as state management