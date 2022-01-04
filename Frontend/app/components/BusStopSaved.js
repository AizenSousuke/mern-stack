import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { Icon, ListItem, Overlay } from "react-native-elements";
import { GetBusStop, GetBusStopByCode } from "../api/api";
import { Pressable } from "react-native";
import BusStop from "./BusStop";
import AuthConsumer from "../context/AuthContext";

export const BusStopSaved = ({ code }) => {
	const [busStop, setBusStop] = useState(null);
	const [busStopData, setBusStopData] = useState(null);
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [arrow, setArrow] = useState(false);
	const [overlayVisible, setOverlayVisible] = useState(false);

	useEffect(() => {
		console.log("Getting data for " + code);
		getBusStopData(code);
	}, [code]);

	const getBusStopData = () => {
		GetBusStopByCode(code)
			.then((res) => {
				setBusStop(res.busStop);
			})
			.catch((err) => console.error(err));
		GetBusStop(code)
			.then((res) => {
				setBusStopData(res.data);
			})
			.catch((err) => console.error(err));
	};

	return (
		<View>
			<ListItem
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
						{busStop
							? busStop.Description
							: "Bus Stop Name"}
					</ListItem.Title>
					<ListItem.Subtitle>
						{busStop ? busStop.RoadName : "Address"} (
						{code ?? "Bus Stop Code"})
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
												{/* <ListItem>
													<ListItem.Title>
														Add to:
													</ListItem.Title>
												</ListItem>
												<ListItem
													onPress={() => {
														this.setState(
															(state) => ({
																overlayVisible:
																	!state.overlayVisible,
															}),
															() => {
																SaveSettings(
																	auth.token,
																	code
																);
															}
														);
													}}
												>
													<ListItem.Subtitle>
														Going Out
													</ListItem.Subtitle>
												</ListItem>
												<ListItem
													onPress={() => {
														this.setState(
															(state) => ({
																overlayVisible:
																	!state.overlayVisible,
															}),
															() => {
																SaveSettings(
																	auth.token,
																	code,
																	false
																);
															}
														);
													}}
												>
													<ListItem.Subtitle>
														Going Home
													</ListItem.Subtitle>
												</ListItem> */}
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
