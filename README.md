# Mern App

## Running the App
Ensure that the android emulator with expo installed is running already.
Open up terminal in the application root directory and run the following commands:

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
- Auth
- Settings
- Save\Load
- Redux as state management