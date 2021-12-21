import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Linking, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "react-native-elements";
import { GetSettings, CheckToken } from "./app/api/api";
import SearchButton from "./app/components/SearchButton";
import TabNavigator from "./app/components/TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "./app/screens/Search";
import * as config from "./config/default.json";
import * as WebBrowser from "expo-web-browser";
import { AuthProvider } from "./app/context/AuthContext";
import { SettingsProvider } from "./app/context/SettingsContext";

const Stack = createStackNavigator();

// Don't move or it will cause issues with Tab Navigator
const Home = ({ navigation }) => {
	return (
		<View style={{ flex: 1 }}>
			<Header
				placement={"center"}
				centerComponent={{
					text: "Yet Another SG Bus App",
					style: { color: "white", fontSize: 18 },
				}}
				rightComponent={{
					icon: "login",
					color: "white",
					onPress: async () => {
						var result = await AsyncStorage.getItem(config.TOKEN);

						if (result) {
							console.log(
								"Getting token from async storage " + result
							);

							// Check if token is still valid
							const valid = await CheckToken().catch((error) => {
								console.error(error);
								return false;
							});
							if (!valid) {
								ToastAndroid.show(
									"Token is not valid. Please relogin.",
									1000
								);
							}
							result = valid.data;
							if (result) {
								ToastAndroid.show(
									"You are already logged in",
									1000
								);
							}
						}

						if (!result) {
							// Get new token
							console.log("Signing in");
							const URL = `${config.BACKEND_API}/auth/facebook`;

							const result = await WebBrowser.openBrowserAsync(
								URL
							);
							if (result) {
								console.log(
									"Result: " + JSON.stringify(result)
								);
							}
						}
					},
				}}
			/>
			<TabNavigator />
			<SearchButton
				onPress={() => {
					navigation.navigate("Search");
				}}
			/>
		</View>
	);
};

export default function App() {
	const [authToken, setAuthToken] = useState(null);
	const [settings, setSettings] = useState(null);
	useEffect(() => {
		Linking.addEventListener("url", _handleURL);
		console.log("added event listener");
		return () => {
			// Cleanup
			Linking.removeAllListeners("url");
			console.log("removed event listener");
		};
	});

	const _handleURL = async (event) => {
		console.log("Handling URL into app: " + event.url);
		const token = event.url.split("token=")[1].split("#_=_")[0];
		console.log("token " + token);
		console.log("Saving token to async storage");
		await AsyncStorage.setItem(config.TOKEN.toString(), token, (error) => {
			console.error(error);
		});
		// Save token
		setAuthToken(token);
		_getData();
	};

	const _getData = async () => {
		const settings = await GetSettings();
		console.log(settings);
		setSettings(settings);
	};

	return (
		<AuthProvider value={authToken}>
			<SettingsProvider value={settings}>
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
