import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import BusDetails from "./BusDetails";
import AppStyles from "../../assets/css/AppStyles";
import ModalAdder from "./ModalAdder";
import BusLocation from "./BusLocation";

const BusStop = ({ busStop, busStopData }) => {
	return (
		<View style={AppStyles.busStop}>
			{busStopData != null ? (
				busStopData.Services?.sort((a) => a.ServiceNo).map(
					(service, key) => {
						return (
							<BusDetails
								key={key}
								modalKey={key}
								busNumber={service.ServiceNo}
								details={service}
								busStopData={busStopData}
								busStop={busStop}
							/>
						);
					}
				)
			) : (
				<Text>No bus stop data found from LTA's API</Text>
			)}
		</View>
	);
};

export default BusStop;
