import React from "react";
import { View, Text } from "react-native";
import BusStop from "../components/BusStop";
import styles from "../../assets/css/AppStyles";

const BusStopDetails = () => {
	return (
		<View>
			<Text style={styles.busStopDetails}>Bus Stop Details</Text>
			<BusStop code={44229} />
		</View>
	);
};

export default BusStopDetails;
