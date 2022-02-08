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
import AppStyles from "../../assets/css/AppStyles";

const BusInformation = ({ busNumber }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<SafeAreaView>
			<Header
				centerComponent={
					<Text style={AppStyles.busRouteNumber}>
						Bus {busNumber} Information
					</Text>
				}
			/>
			<ButtonGroup
				buttonStyle={AppStyles.buttonGroupStyle}
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
