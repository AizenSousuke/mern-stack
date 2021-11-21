import React, { useState, useEffect } from "react";
import { Button } from "react-native";
import { View, Text, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GetBusStopByCode } from "../api/api";
import BusStopListPureComponent from "../components/BusStopListPureComponent";

export default function GoingOut() {
	const [refreshing, setRefreshing] = useState(false);
	useEffect(() => {}, []);
	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => {}}
				></RefreshControl>
			}
		></ScrollView>
	);
}
