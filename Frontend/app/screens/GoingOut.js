import React, { useState, useEffect } from "react";
import { View, Text, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Consumer from "../context/AuthContext";

export default function GoingOut() {
	const [refreshing, setRefreshing] = useState(false);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => {}}
				></RefreshControl>
			}
		>
			<Consumer>
				{(ctx) => {
					console.log(ctx);
					return <Text>{JSON.stringify(ctx)}</Text>
				}}
			</Consumer>
		</ScrollView>
	);
}
