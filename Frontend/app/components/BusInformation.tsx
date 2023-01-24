import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ButtonGroup, Card, Chip, Header, Icon, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyles from "../../assets/css/AppStyles";
import ColourScheme from "../settings/ColourScheme.json";
import { GetBusData, GetBusRouteData } from "../api/api";
import Table from "./Table";

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
			await updatePageData(selectedIndex);
		})();
	}, []);

	const updatePageData = async (index: number) => {
		var data = null;
		setSelectedIndex(index);
		switch (index) {
			case 1:
				// Bus Routes
				console.log("Getting bus route data for bus number", busNumber);
				data = await GetBusRouteData(busNumber);
				if (data) {
					setRoute(data.routes);
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
					updatePageData(index);
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
						{/* <StepIndicator
							direction="vertical"
							currentPosition={1}
							stepCount={route.length}
							labels={route.map((r) => r.BusStopCode)}
							// stepCount={3}
							// labels={["Step 1", "Step 2", "Step 3"]}
							// renderStepIndicator={(position, stepStatus) => {
							// 	<Text key={position}>Indicator: {position}</Text>
							// }}
							// renderLabel={(position, stepStatus, label) => {
							// 	<Text key={position}>Label: {position}{stepStatus}{label}</Text>
							// }}
						/> */}
						{route.map((r, index) => {
							return (
								<View key={index}>
									<Chip
										key={index}
										title={
											r.BusStopData[0].Description +
											" (" +
											r.BusStopCode +
											")"
										}
										onPress={() => {}}
									></Chip>
									{index != route.length - 1 ? <Icon name="caret-down" type="font-awesome" /> : <></>}
									
								</View>
							);
						})}
					</Card>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default BusInformation;
