import React, { useState, useEffect } from "react";
import { Text, ToastAndroid, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { Icon, ListItem, Overlay } from "react-native-elements";
import {
	GetBusStop,
	GetBusStopByCode,
	RemoveCodeFromSettings,
} from "../api/api";
import { Pressable } from "react-native";
import BusStop from "./BusStop";
import AuthConsumer from "../context/AuthContext";
import AppStyles from "../../assets/css/AppStyles";
import ColourScheme from "../settings/ColourScheme.json";

export const BusStopSaved = ({
	code,
	GoingOut,
}: {
	code: any;
	GoingOut: boolean;
}) => {
	const [busStop, setBusStop] = useState(null);
	const [busStopData, setBusStopData] = useState(null);
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [arrow, setArrow] = useState(false);
	const [overlayVisible, setOverlayVisible] = useState(false);

	useEffect(() => {
		console.log("Getting data for " + code);
		getBusStopData();
	}, [code]);

	const getBusStopData = () => {
		GetBusStopByCode(code)
			.then((res) => {
				setBusStop(res.busStop);
			})
			.catch((error) => console.error(error));
		GetBusStop(code)
			.then((res) => {
				setBusStopData(res.data);
			})
			.catch((error) => console.error(error));
	};

	return (
		<View>
			<ListItem
				containerStyle={{ backgroundColor: ColourScheme.primary }}
				topDivider
				bottomDivider
				onPress={() => {
					setIsCollapsed(!isCollapsed);
					setArrow(!arrow);
				}}
			>
				<Icon
					name={
						arrow ? "keyboard-arrow-down" : "keyboard-arrow-right"
					}
				/>
				<ListItem.Content>
					<ListItem.Title>
						<Text style={AppStyles.busStopName}>
							{busStop ? busStop.Description : "Bus Stop Name"}
						</Text>
					</ListItem.Title>
					<ListItem.Subtitle>
						<Text style={AppStyles.busStopRoadName}>
							{busStop ? busStop.RoadName : "Address"} (
							{code ?? "Bus Stop Code"})
						</Text>
					</ListItem.Subtitle>
				</ListItem.Content>
				{isCollapsed ? (
					<Pressable
						onPress={() => setOverlayVisible(!overlayVisible)}
						android_ripple={{ borderless: true }}
					>
						<View>
							<Icon name="more-vert" />
							<Overlay
								isVisible={overlayVisible}
								onBackdropPress={() =>
									setOverlayVisible(!overlayVisible)
								}
							>
								<AuthConsumer>
									{(auth) => {
										return (
											<View>
												<ListItem>
													<ListItem.Title>
														What do you want to do?
													</ListItem.Title>
												</ListItem>
												<ListItem
													onPress={async () => {
														setOverlayVisible(
															!overlayVisible
														);
														await RemoveCodeFromSettings(
															auth.token,
															code,
															GoingOut
														)
															.then((res) => {
																// Refresh state
															})
															.catch((error) => {
																ToastAndroid.show(
																	error,
																	ToastAndroid.SHORT
																);
															});
													}}
												>
													<ListItem.Subtitle>
														Delete
													</ListItem.Subtitle>
												</ListItem>
											</View>
										);
									}}
								</AuthConsumer>
							</Overlay>
						</View>
					</Pressable>
				) : (
					<Pressable
						onPress={() => {
							console.log("Refreshing bus stop " + code);
							getBusStopData();
						}}
						android_ripple={{ borderless: true }}
					>
						<View>
							<Icon name="refresh" />
						</View>
					</Pressable>
				)}
			</ListItem>
			<Collapsible collapsed={isCollapsed}>
				{busStopData != null ? (
					<BusStop busStopData={busStopData} />
				) : (
					<Text>No Data</Text>
				)}
			</Collapsible>
		</View>
	);
};

export default BusStopSaved;
