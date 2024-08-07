import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Linking, ToastAndroid } from "react-native";
import { GetSettings, CheckTokenExpiry } from "./app/api/api";
import Home from "./app/components/Home";
import { AuthProvider } from "./app/context/AuthContext";
import { SettingsProvider } from "./app/context/SettingsContext";
import LocationModal from "./app/screens/LocationModal";
import Search from "./app/screens/Search";
import Constants from "expo-constants";
import { store } from "./app/redux/store";
import {
	loggedIn,
	setToken,
} from "./app/redux/features/homePage/homePageSlice";
import { addBusStopBus } from "./app/redux/features/busStops/busStopsSlice";
import { Direction } from "./app/classes/Enums";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const App = () => {
	let authToken = useSelector((state) => state.home.token);
	let goingOut = useSelector((state) => state.busStop.GoingOut);
	let goingHome = useSelector((state) => state.busStop.GoingHome);

	useEffect(() => {
		console.log(
			"Constants expoConfig extra: " +
				JSON.stringify(Constants.expoConfig?.extra, null, "\t")
		);
		console.log(`Linking URI: ${Constants.linkingUri}`);
		Linking.addEventListener("url", _handleURL);
		console.log("added event listener");
		console.log("Looking for token - authToken: " + authToken);
		const useEffectLoadTokenFunc = async () => {
			console.log("Running useEffectLoadTokenFunc");
			await _loadToken();
		};

		useEffectLoadTokenFunc().catch((error) => {
			console.error("useEffectLoadTokenFunc:", error);
		});

		return () => {
			// Cleanup
			Linking.removeAllListeners("url");
			console.log("removed event listener");
		};
	}, []);

	const _checkTokenExpiry = async (token: string) => {
		return await CheckTokenExpiry(token)
			.then((res) => {
				console.log("Res in _checkTokenExpiry:" + JSON.stringify(res));
				if (res.expired) {
					console.log("CheckTokenExpiry: Token has expired");
					return true;
				}

				return false;
			})
			.catch((error) => {
				console.error("_checkTokenExpiry: " + error);
				return true;
			});
	};

	const _loadToken = async () => {
		console.log("Running _loadToken");
		if (!authToken) {
			console.log("AuthToken is null");
			await AsyncStorage.getItem(
				process.env.TOKEN ?? Constants?.expoConfig?.extra?.TOKEN,
				async (error, result: any) => {
					console.log("Token Result:", result);
					if (result) {
						console.log("_loadToken: " + error + "|" + result);
						if (!(await _checkTokenExpiry(result))) {
							store.dispatch(setToken(result));
							console.log("Attempting to load settings");
							// Passing token instead of authToken because setAuthToken is async and updates according to react
							await _loadSettings(result);
							return;
						}

						console.warn("Token has expired");
						await updateToken(null);
						// Ask to re-login to renew token and reload settings
						ToastAndroid.show(
							"Please re-login.",
							ToastAndroid.SHORT
						);
					} else {
						console.log("No token found in Async Storage.");
					}
				}
			);
		}
	};

	const _loadSettings = async (token: string) => {
		if (goingHome === null || goingOut === null) {
			console.log("Loading settings");
			await _getData(token);
		}
	};

	const _handleURL = async (event: any) => {
		try {
			console.log("TOKEN: " + Constants?.expoConfig?.extra?.TOKEN);
			console.log("event" + JSON.stringify(event));
			console.log("Handling URL into app: " + event.url);
			const token: string = event.url.split("token=")[1].split("#_=_")[0];
			console.log("Token from url:", token);
			if (token) {
				console.log("Going to save the token: " + token);
				console.log("Saving token to async storage");
				await AsyncStorage.setItem(
					process.env.TOKEN ?? Constants?.expoConfig?.extra?.TOKEN,
					token.toString(),
					(error) => {
						console.log("Saving new token: " + error + "|" + token);
					}
				);

				// Save token
				store.dispatch(loggedIn(true));
				store.dispatch(setToken(token));
				// console.log("New store: ", store.getState());

				// Get settings data
				await _getData(token);
			}
		} catch (error: any) {
			ToastAndroid.show(error, ToastAndroid.SHORT);
		}
	};

	const _getData = async (token: string | null = null) => {
		try {
			console.log("Token in _getData: " + token);
			await GetSettings(token ?? authToken)
				.then((res) => {
					console.log(
						"Settings res in _getData: " + JSON.stringify(res)
					);
					// Save settings here
					if (res.settings?.Settings) {
						console.log("Saving settings");
						// setSettings(res.settings?.Settings);
						const goingHome: Array<string> =
							res.settings?.Settings?.GoingHome;
						const goingOut: Array<string> =
							res.settings?.Settings?.GoingOut;
						console.log(
							"Going home: ",
							goingHome,
							"Going out: ",
							goingOut
						);
						goingOut.forEach((busStop) => {
							store.dispatch(
								addBusStopBus({
									direction: Direction.GoingOut,
									busStopCode: busStop,
								})
							);
						});
						goingHome.forEach((busStop) => {
							store.dispatch(
								addBusStopBus({
									direction: Direction.GoingHome,
									busStopCode: busStop,
								})
							);
						});
						ToastAndroid.show(res.msg, ToastAndroid.SHORT);
					} else {
						ToastAndroid.show(res.msg, ToastAndroid.SHORT);
					}
				})
				.catch((error) => {
					console.error(error.msg);
					ToastAndroid.show(
						"Failed to get settings",
						ToastAndroid.SHORT
					);
				});
		} catch (error: any) {
			ToastAndroid.show("Failed to get data", ToastAndroid.SHORT);
		}
	};

	const updateToken = async (token = null) => {
		console.log("Update token check");
		// Remove
		if (!token) {
			await AsyncStorage.removeItem(
				process.env.TOKEN ?? Constants?.expoConfig?.extra?.TOKEN,
				(error: any) => {
					if (error) {
						ToastAndroid.show(error, ToastAndroid.SHORT);
					} else {
						// Update state
						store.dispatch(setToken(null));
						store.dispatch(loggedIn(false));
						ToastAndroid.show(
							"You have been logged out.",
							ToastAndroid.SHORT
						);
					}
				}
			);
		} else {
			await AsyncStorage.setItem(
				process.env.TOKEN ?? "TOKEN", // Constants?.expoConfig?.extra?.TOKEN,
				token,
				(error: any) => {
					if (error) {
						ToastAndroid.show(error, ToastAndroid.SHORT);
					} else {
						// Update state
						store.dispatch(setToken(token));
						if (token != "") {
							store.dispatch(loggedIn(true));
							ToastAndroid.show(
								"Successfully updated token",
								ToastAndroid.SHORT
							);
						}
					}
				}
			);
		}
	};

	return (
		<AuthProvider
			value={authToken}
			updateToken={async () => await updateToken(null)}
		>
			<SettingsProvider
				value={{
					GoingOut: goingOut,
					GoingHome: goingHome,
				}}
				updateSettings={async () => {
					console.log(
						"Settings provider updateSettings with token: " +
							authToken
					);
					await _getData(authToken);
				}}
			>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Home"
							component={Home}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Search"
							component={Search}
							options={{
								headerShown: true,
								// headerTintColor: ColourScheme.secondary,
								// headerStyle: { backgroundColor: "black" },
							}}
							listeners={{
								beforeRemove: async () =>
									await _getData(authToken),
							}}
						/>
						<Stack.Screen
							name="Location"
							component={LocationModal}
							options={{
								// headerShown: true,
								// headerTintColor: "white",
								// headerStyle: { backgroundColor: "black" },
								cardStyle: {
									backgroundColor: "transparent",
								},
							}}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</SettingsProvider>
		</AuthProvider>
	);
};

export default App;
