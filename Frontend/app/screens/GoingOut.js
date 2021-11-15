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
				<Text>{sampleText.slice(0, 10000)}</Text>
			) : (
				<Text>No Data: {sampleText}</Text>
			)}
			<Button
				title="Get last updated date"
				onPress={() =>
					getLastUpdatedDate().then((res) => setSampleText(res))
				}
			/>
			<Button
				title="Get data"
				onPress={() =>
					getData().then(
						(res) => setSampleText(JSON.stringify(res)),
						(err) => setSampleText("Error getting data")
					)
				}
			/>
			<Button
				title="Check DB Table"
				onPress={() =>
					BusStopTableCheck().then((res) => {
						setSampleText(res);
					})
				}
			/>
			<Button
				title="Store data"
				onPress={() => storeData("Lorem ipsum")}
			/>
			<Button
				title="Delete data"
				onPress={() =>
					DeleteBusStopList().then(
						() => setSampleText("Deleted data"),
						() => setSampleText("Error")
					)
				}
			/>
			<Button
				title="Delete table"
				onPress={() =>
					DeleteTable("BusStopList").then(() =>
						setSampleText("Deleted tables")
					)
				}
			/>
			<Text>Add some bus stops</Text>
		</ScrollView>
	);
};
