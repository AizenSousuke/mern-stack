import React from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BusStopSaved from "../components/BusStopSaved";
import { store } from "../redux/store";

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
			{props?.settings?.GoingHome?.map((busStop: any, index: number) => (
				<BusStopSaved
					key={index}
					code={busStop}
					GoingOut={false}
					settingsUpdaterFunc={() => props.updateSettings()}
				/>
			))}
		</ScrollView>
	);
};

export default GoingHome;
