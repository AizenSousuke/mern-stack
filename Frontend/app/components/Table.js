import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";

const Table = (data, columnWidth = 1) => {
	return (
		<View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
			{/* {data.map((row) => {
				return (
					<View style={{ flex: columnWidth }}>
						{JSON.stringify(row)}
					</View>
				);
			})} */}
			<View style={{ flex: 1 }}>
				{/* <Text>{JSON.stringify(data)}</Text> */}
			</View>
		</View>
	);
};

export default Table;
