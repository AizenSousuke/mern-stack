import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
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
import { GetBusData, GetBusRouteData } from "../api/api";
import Table from "./Table";
import StepIndicator from "react-native-step-indicator";

const BusInformation = ({
	busNumber,
	busStopCode,
}: {
	busNumber: string;
	busStopCode: string;
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [information, setInformation] = useState([{}]);
	const [route, setRoute] = useState([{}]);

	useEffect(() => {
		(async () => {
			await updatePageData();
		})();
	}, []);

	const updatePageData = async () => {
		var data = null;
		switch (selectedIndex) {
			case 1:
				// Bus Routes
				console.log("Getting bus route data for bus number", busNumber);
				data = await GetBusRouteData(busNumber);
				if (data) {
					setRoute(data.routes);
					console.log("Route length:", data.routes.length);
				}
				break;

			default:
				// Bus Data
				console.log(
					"Getting bus data for bus number",
					busNumber,
					"and bus stop code",
					busStopCode
				);
				data = await GetBusData(busNumber, busStopCode);
				if (data) {
					setInformation(data.routes);
				}
				break;
		}
	};

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
					updatePageData();
				}}
			/>
			<ScrollView style={{ flexGrow: 0 }}>
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
					<StepIndicator
						direction="vertical"
						currentPosition={2}
						labels={route.map(r => r.BusStopCode)}
						// stepCount={3}
						// labels={["Step 1", "Step 2", "Step 3"]}
						// renderStepIndicator={(position, stepStatus) => {
						// 	<Text key={position}>Indicator: {position}</Text>
						// }}
						// renderLabel={(position, stepStatus, label) => {
						// 	<Text key={position}>Label: {position}{stepStatus}{label}</Text>
						// }}
					/>
				</Card>
			)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default BusInformation;
