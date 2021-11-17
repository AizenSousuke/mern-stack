import { ToastAndroid } from "react-native";
import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import { SearchBusStop, getBusStops, getData, storeData } from "../api/api";
import { FlatList } from "react-native";
import Fuse from "fuse.js";
import BusStopListPureComponent from "../components/BusStopListPureComponent";

const options = {
	keys: ["BusStopCode", "RoadName"],
	minMatchCharLength: 4,
};

const renderItem = ({ item }) => (
	<BusStopListPureComponent
		name={item.Description}
		address={item.RoadName}
		code={item.BusStopCode}
	/>
);

const Search = () => {
	const [search, updateSearch] = useState("");
	const [busStops, setbusStops] = useState([]);
	const searchLength = 1;
	const pageSearchLength = 11;
	const limitResultsPerPage = 5;
	const limitResults = 10;

	const searchForBusStops = () => {
		console.log("Searching for bus stops");
		// Search for bus stops
		if (search.length >= searchLength) {
			// Check if there's data in the db table
			SearchBusStop(search).then((res) => {
				console.log(res);
				setBusStops(res);
			}, (rej) => {
				ToastAndroid.show(
					"Search failed",
					ToastAndroid.SHORT
				);
			});
		} else {
			ToastAndroid.show(
				"Enter at least 1 character.",
				ToastAndroid.SHORT
			);
		}
	};

	const viewabilityConfig = {
		// itemVisiblePercentThreshold: 100,
		minimumViewTime: 1000,
	};

	return (
		<FlatList
			windowSize={2}
			ListHeaderComponent={
				<SearchBar
					placeholder={"Search for a bus stop"}
					onChangeText={(value) => {
						// console.log("Value: " + value);
						updateSearch(value);
					}}
					onSubmitEditing={() => {
						console.log("Searching for: " + search);
						searchForBusStops();
					}}
					value={search.toString()}
				/>
			}
			stickyHeaderIndices={[0]}
			initialNumToRender={limitResultsPerPage}
			maxToRenderPerBatch={limitResultsPerPage}
			data={busStops}
			renderItem={renderItem}
			keyExtractor={(item) => item.BusStopCode}
			viewabilityConfig={viewabilityConfig}
		/>
	);
};

export default Search;
