import React from "react";
import { View, Text } from "react-native";
import BusStop from "../components/BusStop";
import AppStyles from "../../assets/css/AppStyles";

const BusStopDetails = () => {
	return (
		<View>
			<Text style={AppStyles.busStopDetails}>Bus Stop Details</Text>
		</View>
	);
};

export default BusStopDetails;
