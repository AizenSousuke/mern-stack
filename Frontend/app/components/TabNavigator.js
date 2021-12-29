import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GoingHome from "../screens/GoingHome";
import { Icon } from "react-native-elements";
import GoingOut from "../screens/GoingOut";

const Tab = createBottomTabNavigator();

function TabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName={"Home"}
			tabBarOptions={{
                style: { minHeight: 70 },
                activeTintColor: "black",
				activeBackgroundColor: "#b7b7b7",
			}}
		>
			<Tab.Screen
				name="Going Out"
				component={GoingOut}
				options={{
					tabBarIcon: () => {
						return <Icon name="directions-run" />;
					},
				}}
			></Tab.Screen>
			<Tab.Screen
				name="Going Home"
				component={GoingHome}
				options={{
					tabBarIcon: () => {
						return <Icon name="home" />;
					},
				}}
			></Tab.Screen>
		</Tab.Navigator>
	);
}

export default TabNavigator;
