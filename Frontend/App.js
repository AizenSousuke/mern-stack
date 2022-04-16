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

const Stack = createStackNavigator();

export default function App() {
	const [authToken, setAuthToken] = useState(null);
	const [settings, setSettings] = useState(null);
	useEffect(() => {
		Linking.addEventListener("url", _handleURL);
		console.log("added event listener");
		console.log("Looking for token");
		_loadToken();
		return () => {
			// Cleanup
			Linking.removeAllListeners("url");
			console.log("removed event listener");
		};
	}, []);

	const _checkTokenExpiry = async (token) => {
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
		if (authToken === null) {
			await AsyncStorage.getItem(
				process.env.TOKEN ?? Constants.manifest.extra.TOKEN,
				async (error, result) => {
					if (result) {
						console.log("_loadToken: " + error + "|" + result);
						if (!(await _checkTokenExpiry(result))) {
							setAuthToken(result);
							console.log("Attempting to load settings");
							// Passing token instead of authToken because setAuthToken is async and updates according to react
							_loadSettings(result);
							return;
						}

						console.warn("Token has expired");
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

	const _loadSettings = async (token) => {
		if (settings === null) {
			console.log("Loading settings");
			await _getData(token);
		}
	};

	const _handleURL = async (event) => {
		try {
			console.log("event" + JSON.stringify(event));
			console.log("Handling URL into app: " + event.url);
			const token = event.url.split("token=")[1].split("#_=_")[0];
			if (token) {
				console.log("Going to save the token: " + token);
				console.log("Saving token to async storage");
				await AsyncStorage.setItem(
					process.env.TOKEN ?? Constants.manifest.extra.TOKEN,
					token.toString(),
					(error, result) => {
						console.log(
							"Saving new token: " + error + "|" + result
						);
					}
				);

				// Save token
				setAuthToken(token);

				// Get settings data
				await _getData(token);
			}
		} catch (error) {
			ToastAndroid.show(error, ToastAndroid.SHORT);
		}
	};

	const _getData = async (token = null) => {
		try {
			console.log("Token in _getData: " + token);
			await GetSettings(token ?? authToken)
				.then((res) => {
					console.log(
						"Settings res in _getData: " + JSON.stringify(res)
					);
					// Save settings here
					if (res.settings?.Settings) {
						setSettings(res.settings?.Settings);
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
		} catch (error) {
			ToastAndroid.show("Failed to get data", ToastAndroid.SHORT);
		}
	};

	const updateToken = async (token = null) => {
		// Remove
		if (!token) {
			await AsyncStorage.removeItem(
				process.env.TOKEN ?? Constants.manifest.extra.TOKEN,
				(error) => {
					if (error) {
						ToastAndroid.show(error, ToastAndroid.SHORT);
					} else {
						// Update state
						setAuthToken(null);
						ToastAndroid.show(
							"Successfully cleared token and logged out",
							ToastAndroid.SHORT
						);
					}
				}
			);
		} else {
			await AsyncStorage.setItem(process.env.TOKEN ?? Constants.manifest.extra.TOKEN, token, (error) => {
				if (error) {
					ToastAndroid.show(error, ToastAndroid.SHORT);
				} else {
					// Update state
					setAuthToken(token);
					if (token != "") {
						ToastAndroid.show(
							"Successfully updated token",
							ToastAndroid.SHORT
						);
					}
				}
			});
		}
	};

	return (
		<AuthProvider value={authToken} updateToken={() => updateToken(null)}>
			<SettingsProvider
				value={settings}
				updateSettings={() => _getData(authToken)}
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
}
