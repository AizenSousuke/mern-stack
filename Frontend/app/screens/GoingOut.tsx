import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BusStopSaved from "../components/BusStopSaved";

const GoingOut = (props: any) => {
	const [refreshing, setRefreshing] = useState(false);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => {
						console.log("Refreshing");
						props.updateSettings();
					}}
				></RefreshControl>
			}
		>
			{props.settings?.GoingOut?.map((busStop: any, index: any) => (
				<BusStopSaved key={index} code={busStop} GoingOut={true} />
			))}
		</ScrollView>
	);
};

export default GoingOut;
