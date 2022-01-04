import React, { useState, useEffect } from "react";
import { View, Text, RefreshControl } from "react-native";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Consumer from "../context/AuthContext";
import {GetBusStop} from "../api/api";

export default function GoingOut() {
	const [refreshing, setRefreshing] = useState(false);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => {
						console.log("Refreshing");
					}}
				></RefreshControl>
			}
		>
			{/* <Consumer>
				{(ctx) => {
					console.log(ctx);
					return <Text>Token: {JSON.stringify(ctx)}</Text>;
				}}
			</Consumer> */}
			<Button onPress={async () => {
				console.log("GET");
				await GetBusStop(44229).then(res => {
					console.log(res);
				}).catch(err => {
					console.error("Error in GET button: " + err);
				});
			}}title="GET" />
		</ScrollView>
	);
}
