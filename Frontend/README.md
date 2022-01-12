# Yet Another SG Bus App
![Image](https://i.imgur.com/vTFjIeU.png)
![Image](https://i.imgur.com/WvHurAC.png)
![Image](https://i.imgur.com/ev4KjpL.png)

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

# Todo:
- Save all bus stops to database and set the last updated time
  - To compare the last updated time from the server\current time and if it is later than the one in DB, drop the db and repopulate it again based on the latest data. To use 1 week for now (update weekly).
  - Remember to update \ delta the data for any fixes since LTA might be wrong.
- User Login using Firebase Login
  - Store user data on their device (bus stop list and favourites)
- Save the startup page accordingly in db settings
- Location based bus stop search
- Use an online DB like Mongo DB to store data and retrieve data instead
  - Have a job on the db server to parse new data from LTA and massage it every week
  - Locally store user's data and cached data from Mongo