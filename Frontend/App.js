import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Linking, ToastAndroid } from "react-native";
import { GetSettings } from "./app/api/api";
import Home from "./app/components/Home";
import { AuthProvider } from "./app/context/AuthContext";
import { SettingsProvider } from "./app/context/SettingsContext";
import Search from "./app/screens/Search";
import * as config from "./config/default.json";

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

	const _loadToken = async () => {
		if (authToken === null) {
			await AsyncStorage.getItem(config.TOKEN, (error, result) => {
				if (result) {
					console.log("_loadToken: " + error + "|" + result);
					setAuthToken(result);
					console.log("Attempting to load settings");
					// Passing token because setAuthToken is async and updates according to react
					_loadSettings(result);
				} else {
					console.log("No token found in Async Storage");
				}
			});
		}
	};

	const _loadSettings = async (token) => {
		if (settings === null) {
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
					config.TOKEN,
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
					ToastAndroid.show(
						"Failed to get settings",
						ToastAndroid.SHORT
					);
				});
		} catch (error) {
			ToastAndroid.show("Failed to get data", ToastAndroid.SHORT);
		}
	};

	return (
		<AuthProvider value={authToken}>
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
								headerTintColor: "white",
								headerStyle: { backgroundColor: "black" },
							}}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</SettingsProvider>
		</AuthProvider>
	);
}
