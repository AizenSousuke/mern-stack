import React, { useState } from "react";
import { RefreshControl, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BusStopSaved from "../components/BusStopSaved";

const GoingHome = (props: any) => {
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
			{props?.settings?.GoingHome?.map((busStop: any, index: number) => (
				<BusStopSaved key={index} code={busStop} GoingOut={false} />
			))}
		</ScrollView>
	);
};

export default GoingHome;
