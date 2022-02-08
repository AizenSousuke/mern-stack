import React, { useState } from "react";
import {
	Button,
	ButtonGroup,
	Card,
	Header,
	Overlay,
	Text,
} from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../assets/css/AppStyles";

const BusInformation = ({ busNumber }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<SafeAreaView>
			<Header
				centerComponent={
					<Text style={styles.busRouteNumber}>
						Bus {busNumber} Information
					</Text>
				}
			/>
			<ButtonGroup
				buttonStyle={styles.buttonGroupStyle}
				buttons={["Information", "Bus Route"]}
				selectedIndex={selectedIndex}
				onPress={(index) => {
					setSelectedIndex(index);
				}}
			/>
		</SafeAreaView>
	);
};

export default BusInformation;
