import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import BusDetails from "./BusDetails";
import AppStyles from "../../assets/css/AppStyles";
import ModalAdder from "./ModalAdder";
import BusLocation from "./BusLocation";

const BusStop = ({ busStopData }: { busStopData: any }) => {
	return (
		<View style={AppStyles.busStop}>
			{busStopData != null ? (
				busStopData.Services?.sort((a: any) => a.ServiceNo).map(
					(service: any, key: number) => {
						return (
							<BusDetails
								key={key}
								busNumber={service.ServiceNo}
								details={service}
								busStopData={busStopData}
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
