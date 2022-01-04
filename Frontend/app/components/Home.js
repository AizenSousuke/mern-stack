import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { ToastAndroid, View } from "react-native";
import { Header } from "react-native-elements";
import * as config from "../../config/default.json";
import { LogOut } from "../api/api";
import SearchButton from "../components/SearchButton";
import TabNavigator from "../components/TabNavigator";

export const Home = ({ navigation }) => {
	return (
		<View style={{ flex: 1 }}>
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
								ToastAndroid.show(error, ToastAndroid.SHORT);
							}
						);
						const result = await LogOut();
						console.log("Logged out: " + result);
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
						result = await AsyncStorage.getItem(config.TOKEN);

						console.log("Result: " + JSON.stringify(result));

						if (!result) {
							// Get new token
							console.log("Signing in");
							const URL = `${config.BACKEND_API}/auth/facebook`;

							const fblogin = await WebBrowser.openBrowserAsync(
								URL
							);
                            
							if (fblogin) {
								console.log(
									"Logged in with FACEBOOK: " + JSON.stringify(fblogin)
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