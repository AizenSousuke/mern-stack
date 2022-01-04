import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const GoingHome = (props) => {
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
		></ScrollView>
	);
};

export default GoingHome;
