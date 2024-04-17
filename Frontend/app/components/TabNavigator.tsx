import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GoingHome from "../screens/GoingHome";
import { Icon } from "react-native-elements";
import GoingOut from "../screens/GoingOut";
import SettingsConsumer from "../context/SettingsContext";

const Tab = createBottomTabNavigator();

function TabNavigator() {
	return (
		<SettingsConsumer>
			{(settings) => {
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
							children={(navigation: any, route: any) => <GoingOut navigation={navigation} route={route} {...settings} />}
							options={{
								tabBarIcon: () => {
									return <Icon name="directions-run" />;
								},
							}}
						></Tab.Screen>
						<Tab.Screen
							name="Going Home"
							children={(navigation: any, route: any) => <GoingHome navigation={navigation} route={route} {...settings} />}
							options={{
								tabBarIcon: () => {
									return <Icon name="home" />;
								},
							}}
						></Tab.Screen>
					</Tab.Navigator>
				);
			}}
		</SettingsConsumer>
	);
}

export default TabNavigator;
