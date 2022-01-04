import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Linking, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "react-native-elements";
import { GetSettings, CheckToken, LogOut } from "./app/api/api";
import SearchButton from "./app/components/SearchButton";
import TabNavigator from "./app/components/TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "./app/screens/Search";
import * as config from "./config/default.json";
import * as WebBrowser from "expo-web-browser";
import { AuthProvider } from "./app/context/AuthContext";
import { SettingsProvider } from "./app/context/SettingsContext";
import Home from "./app/components/Home";

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
	});

	const _loadToken = async () => {
		await AsyncStorage.getItem(config.TOKEN, (error, result) => {
			console.log("_loadToken: " + error + "|" + result);
			setAuthToken(result);
		});
	}

	const _handleURL = async (event) => {
		console.log("event" + JSON.stringify(event));
		console.log("Handling URL into app: " + event.url);
		const token = event.url.split("token=")[1].split("#_=_")[0];
		console.log("Going to save the token: " + token);
		console.log("Saving token to async storage");
		await AsyncStorage.setItem(config.TOKEN, token.toString(), (error) => {
			console.error(error);
		});

		// Save token
		setAuthToken(token);

		// Get settings data
		await _getData(token);
	};

	const _getData = async (token = null) => {
		try {
			console.log("Token in _getData: " + token);
			await GetSettings(token ?? authToken)
				.then((res) => {
					console.log("Settings res in _getData: " + JSON.stringify(res));
					// Save settings here
					if (res.settings?.Settings) {
						setSettings(JSON.parse(res.settings?.Settings));
						ToastAndroid.show(res.msg, ToastAndroid.SHORT);
					} else {
						ToastAndroid.show(res.msg, ToastAndroid.SHORT);
					}
				})
				.catch((err) => {
					ToastAndroid.show(err.message, ToastAndroid.SHORT);
				});
		} catch (error) {
			ToastAndroid.show(error, ToastAndroid.SHORT);
		}
	};

	return (
		<AuthProvider value={authToken}>
			<SettingsProvider value={settings} updateSettings={() => _getData(authToken)}>
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
							options={{ headerShown: true }}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</SettingsProvider>
		</AuthProvider>
	);
}
