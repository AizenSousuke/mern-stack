import React, { useState, useEffect } from "react";
import { Button } from "react-native";
import { View, Text, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	BusStopTableCheck,
	DeleteBusStopList,
	getData,
	getLastUpdatedDate,
	storeData,
	DeleteTable,
	GetBusStopList,
	getBusStops,
	GetBusStop,
} from "../api/api";
import BusStopListPureComponent from "../components/BusStopListPureComponent";

export default function GoingOut () {
	const [refreshing, setRefreshing] = useState(false);
	const [sampleText, setSampleText] = useState(
		"Amet quis esse ad do reprehenderit ad qui commodo reprehenderit sint ex ullamco exercitation elit."
	);
	useEffect(() => {}, []);
	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => {}}
				></RefreshControl>
			}
		>
			{sampleText != null ? (
				// <Text>{sampleText.slice(0, 10000)}</Text>
				<Text>{sampleText}</Text>
			) : (
				<Text>No Data: {sampleText}</Text>
			)}
			<Button
				title="Get bus stop list data"
				onPress={() =>
					GetBusStop(44229).then(
						(res) => setSampleText(res.Description),
						(err) => setSampleText("Error getting data " + err)
					)
				}
			/>
		</ScrollView>
	);
};
