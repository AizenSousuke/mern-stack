import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { ToastAndroid, View } from "react-native";
import { Header } from "react-native-elements";
import * as config from "../../config/default.json";
import { LogOut } from "../api/api";
import SearchButton from "../components/SearchButton";
import TabNavigator from "../components/TabNavigator";
import AuthConsumer from "../context/AuthContext";
import { CheckTokenExpiry } from "../api/api";
import LocationButton from "./LocationButton";
import ColourScheme from "../settings/ColourScheme.json";

export const Home = ({ navigation }) => {
	return (
		<View style={{ flex: 1 }}>
			<AuthConsumer>
				{(auth) => {
					return (
						<Header
							backgroundColor={ColourScheme.header}
							placement={"center"}
							leftComponent={{
								icon: "logout",
								color: "white",
								onPress: async () => {
									await auth.updateToken();

									await LogOut().then((res) => {
										console.log("Logged out");
									});
								},
							}}
							centerComponent={{
								text: "Yet Another SG Bus App",
								style: { color: "white", fontSize: 18 },
							}}
							rightComponent={{
								icon: auth.token ? "person" : "login",
								color: "white",
								onPress: async () => {
									let result = await AsyncStorage.getItem(
										process.env.TOKEN ?? config.TOKEN
									);

									console.log(
										"Result: " + JSON.stringify(result)
									);

									// Check if the token has expired on the server end
									const tokenExpiry = await CheckTokenExpiry(
										result
									).catch((error) => {
										ToastAndroid.show(
											"Error: " + error,
											ToastAndroid.SHORT
										);

										return null;
									});

									if (
										!result ||
										tokenExpiry?.expired == true
									) {
										// Get new token
										console.log("Signing in");
										const URL = `${process.env.BACKEND_API ?? config.BACKEND_API}/auth/facebook`;

										const fblogin =
											await WebBrowser.openBrowserAsync(
												URL
											);

										if (fblogin) {
											console.log(
												"Logged in with FACEBOOK: " +
													JSON.stringify(fblogin)
											);
										}
									} else {
										ToastAndroid.show(
											"You have already logged in",
											1000
										);
									}
								},
							}}
						/>
					);
				}}
			</AuthConsumer>
			<TabNavigator />
			<LocationButton
				onPress={() => {
					navigation.navigate("Location");
				}}
			/>
			<SearchButton
				onPress={() => {
					navigation.navigate("Search");
				}}
			/>
		</View>
	);
};

export default Home;
