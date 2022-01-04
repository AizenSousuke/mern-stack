import React, { useState } from "react";
import { RefreshControl, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BusStopSaved from "../components/BusStopSaved";

export const GoingOut = (props) => {
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
			{props.settings?.GoingOut?.map((busStop, index) => <BusStopSaved key={index} code={busStop}  />)}
		</ScrollView>
	);
};

export default GoingOut;
