import React from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BusStopSaved from "../components/BusStopSaved";
import { store } from "../redux/store";
import { ISavedBusStopBuses } from "../interfaces/IBusStopSlice";

const GoingHome = (props: any) => {
	const storeState = store.getState();

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={storeState.home.isLoading}
					onRefresh={() => {
						console.log("Refreshing");
						props.updateSettings();
					}}
				></RefreshControl>
			}
		>
			{Object.keys(storeState.busStop.GoingHome).map((key, index) => {
				// const savedBusStopBuses: ISavedBusStopBuses = storeState.busStop.GoingHome[Number(key)];
				return (
					<BusStopSaved
						key={index}
						code={key}
						GoingOut={false}
						settingsUpdaterFunc={() => props.updateSettings()}
					/>
				);
			})}
		</ScrollView>
	);
};

export default GoingHome;
