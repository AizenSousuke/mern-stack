import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
	Button,
	ButtonGroup,
	Card,
	Header,
	Overlay,
	TabView,
	Text,
} from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyles from "../../assets/css/AppStyles";
import ColourScheme from "../settings/ColourScheme.json";
import { GetBusData } from "../api/api";
import Table from "./Table";

const BusInformation = ({ busNumber, busStopCode }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [information, setInformation] = useState([{}]);

	useEffect(() => {
		(async () => {
			console.log("Getting bus data for bus number", busNumber, "and bus stop code", busStopCode);
			const data = await GetBusData(busNumber, busStopCode);
			if (data) {
				setInformation(data.routes);
			}
		})();
	}, []);

	return (
		<SafeAreaView>
			<Header
				centerComponent={
					<Text style={AppStyles.busRouteNumber}>
						Bus {busNumber}
					</Text>
				}
				backgroundColor={ColourScheme.header}
			/>
			<ButtonGroup
				containerStyle={{ marginBottom: 0 }}
				selectedButtonStyle={AppStyles.buttonGroupStyle}
				buttons={["Information", "Route"]}
				selectedIndex={selectedIndex}
				onPress={(index) => {
					setSelectedIndex(index);
				}}
			/>
			{selectedIndex === 0 && (
				<Card>
					<Card.Title>Information</Card.Title>
					<Card.Divider width={1} />
					<Table information={information} />
				</Card>
			)}
			{selectedIndex === 1 && (
				<Card>
					<Card.Title>Route</Card.Title>
					<Card.Divider width={1} />
				</Card>
			)}
		</SafeAreaView>
	);
};

export default BusInformation;
