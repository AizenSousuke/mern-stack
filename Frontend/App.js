import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { Modal, View, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "react-native-elements";
import SearchButton from "./app/components/SearchButton";
import TabNavigator from "./app/components/TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "./app/screens/Search";
import * as config from "./config/default.json";
import { SignIn } from "./app/api/api";
import { WebView } from "react-native-webview";
import {WebBrowser} from "expo";

const Stack = createStackNavigator();

/// Don't move or it will cause issues with Tab Navigator
const Home = ({ navigation }) => {
	const [modalVisible, setModalVisible] = useState(false);
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
						const result = await AsyncStorage.getItem(config.TOKEN);
						if (!result) {
							// Get new token
							console.log("Signing in");
							// await SignIn();
							let authResult = await Linking.openURL("http://localhost:5000/api/auth/facebook");
							if (authResult) {
								// True
								
							}
							// setModalVisible(!modalVisible);
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
			<Modal
				visible={modalVisible}
				animationType={"slide"}
				onRequestClose={() => {
					setModalVisible(false);
				}}
			>
				<WebView source={{ uri: "https://google.com" }}></WebView>
			</Modal>
		</View>
	);
};

export default function App() {
	return (
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
	);
}
