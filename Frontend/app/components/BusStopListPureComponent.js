import React, { PureComponent } from "react";
import { GetBusStop } from "../api/api";
import { Pressable } from "react-native";
import { View, Text } from "react-native";
import Collapsible from "react-native-collapsible";
import { Icon, ListItem, Overlay } from "react-native-elements";
import BusStop from "./BusStop";

export default class BusStopListPureComponent extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			arrow: false,
			overlayVisible: false,
			isCollapsed: true,
			busStopData: null,
		};
		this.getBusStopData = this.getBusStopData.bind(this);
		this.getBusStopData();
	}

	getBusStopData() {
		GetBusStop(this.props.code)
			.then((res) => {
				this.setState(
					(prevState) => {
						return { ...prevState, busStopData: res.data };
					},
					() => {}
				);
			})
			.catch((err) => console.log(err));
	}

	componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	render() {
		const { name, address, code } = this.props;

		return (
			<View>
				<ListItem
					topDivider
					bottomDivider
					onPress={() => {
						this.setState((state) => ({
							isCollapsed: !state.isCollapsed,
						}));
						this.setState((state) => ({ arrow: !state.arrow }));
					}}
				>
					<Icon
						name={
							this.state.arrow
								? "keyboard-arrow-down"
								: "keyboard-arrow-right"
						}
					/>
					<ListItem.Content>
						<ListItem.Title>
							{name ?? "Bus Stop Name"}
						</ListItem.Title>
						<ListItem.Subtitle>
							{address ?? "Address"} ({code ?? "Bus Stop Code"})
						</ListItem.Subtitle>
					</ListItem.Content>
					{this.state.isCollapsed ? (
						<Pressable
							onPress={() =>
								this.setState((state) => ({
									overlayVisible: !state.overlayVisible,
								}))
							}
							android_ripple={{ borderless: true }}
						>
							<View>
								<Icon name="more-vert" />
								<Overlay
									isVisible={this.state.overlayVisible}
									onBackdropPress={() =>
										this.setState((state) => ({
											overlayVisible:
												!state.overlayVisible,
										}))
									}
								>
									<View>
										<ListItem>
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
														console.log(
															"Adding to Going Out List"
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
														console.log(
															"Adding to Going Home List"
														);
													}
												);
											}}
										>
											<ListItem.Subtitle>
												Going Home
											</ListItem.Subtitle>
										</ListItem>
									</View>
								</Overlay>
							</View>
						</Pressable>
					) : (
						<Pressable
							onPress={() => {
								console.log("Refreshing bus stop " + code);
								this.getBusStopData();
							}}
							android_ripple={{ borderless: true }}
						>
							<View>
								<Icon name="refresh" />
							</View>
						</Pressable>
					)}
				</ListItem>
				{/* <Text>{JSON.stringify(this.state.busStopData)}</Text> */}
				<Collapsible collapsed={this.state.isCollapsed}>
					{this.state.busStopData != null ? (
						<BusStop busStopData={this.state.busStopData} />
					) : (
						<Text>No Data</Text>
					)}
				</Collapsible>
			</View>
		);
	}
}
