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

export const Home = ({ navigation }) => {
	return (
		<View style={{ flex: 1 }}>
			<AuthConsumer>
				{(auth) => {
					return (
						<Header
							placement={"center"}
							leftComponent={{
								icon: "logout",
								color: "white",
								onPress: async () => {
									await AsyncStorage.setItem(
										config.TOKEN,
										"",
										(error) => {
											if (error) {
												ToastAndroid.show(
													error,
													ToastAndroid.SHORT
												);
											} else {
												// Remove state

												ToastAndroid.show(
													"Logged out",
													ToastAndroid.SHORT
												);
											}
										}
									);
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
								icon: "login",
								color: "white",
								onPress: async () => {
									let result = await AsyncStorage.getItem(
										config.TOKEN
									);

									console.log(
										"Result: " + JSON.stringify(result)
									);

									if (!result) {
										// Get new token
										console.log("Signing in");
										const URL = `${config.BACKEND_API}/auth/facebook`;

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
			<SearchButton
				onPress={() => {
					navigation.navigate("Search");
				}}
			/>
		</View>
	);
};

export default Home;
