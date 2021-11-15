import { ToastAndroid } from "react-native";
import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import { BusStopTableCheck, getBusStops, getData, storeData } from "../api/api";
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
		BusStopTableCheck().then(
			(res) => {
				// Search for bus stops
				if (search.length >= searchLength) {
					// Check if there's data in the db table
					getData().then((res) => {
						if (res[0] != null) {
							console.log("There's data in the db");
							console.log(
								JSON.parse(res[0].Data).length +
									" items loaded from db"
							);

							options.minMatchCharLength = search.length;
							const fuse = new Fuse(
								JSON.parse(res[0].Data),
								options
							);
							const resultsArray = [];
							fuse.search(search).forEach((s) =>
								resultsArray.push(s.item)
							);
							setbusStops(resultsArray);

							ToastAndroid.show(
								"Search completed.",
								ToastAndroid.SHORT
							);
						} else {
							console.warn("There's no data in the db");

							// 5042 records available
							var arrayOfBusStops = [];
							var arrayOfPromises = [];
							for (
								var pageSearched = 0;
								pageSearched < pageSearchLength;
								pageSearched++
							) {
								arrayOfPromises.push(
									getBusStops(pageSearched)
										.then((res) => res.value)
										.catch((err) => console.log(err))
								);
							}

							Promise.all(arrayOfPromises)
								.then((res) => {
									res.map((busStop) => {
										busStop.forEach((stop) =>
											arrayOfBusStops.push(stop)
										);
									});

									// arrayOfBusStops is the list of all the bus stops

									// Save the results into DB
									storeData(arrayOfBusStops);

									options.minMatchCharLength = search.length;
									const fuse = new Fuse(
										arrayOfBusStops,
										options
									);
									const resultsArray = [];
									fuse.search(search).forEach((s) =>
										resultsArray.push(s.item)
									);
									setbusStops(resultsArray);
								})
								.catch((err) => console.log(err))
								.then(() => {
									console.log("Done getting all bus stops");
									ToastAndroid.show(
										"Search completed.",
										ToastAndroid.SHORT
									);
								});
						}
					});
				} else {
					ToastAndroid.show(
						"Enter at least 1 character.",
						ToastAndroid.SHORT
					);
				}
			},
			(rej) => {
				console.log("No table");
				ToastAndroid.show(
					rej,
					ToastAndroid.SHORT
				);
			}
		);
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
