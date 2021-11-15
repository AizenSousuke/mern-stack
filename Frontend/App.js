import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Header } from "react-native-elements";
import SearchButton from "./app/components/SearchButton";
import TabNavigator from "./app/components/TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "./app/screens/Search";

const Stack = createStackNavigator();

/// Don't move or it will cause issues with Tab Navigator
const Home = ({ navigation }) => {
	return (
		<View style={{ flex: 1 }}>
			<Header
				placement={"center"}
				centerComponent={{
					text: "Yet Another SG Bus App",
					style: { color: "white", fontSize: 18 },
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
