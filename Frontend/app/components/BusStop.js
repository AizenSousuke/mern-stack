import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import BusDetails from "./BusDetails";
import styles from "../../assets/css/AppStyles";
import ModalAdder from "./ModalAdder";
import BusLocation from "./BusLocation";

const BusStop = ({ busStop, busStopData }) => {
	return (
		<View style={styles.busStop}>
			{busStopData != null ? (
				busStopData.Services?.sort((a) => a.ServiceNo).map(
					(service, key) => {
						return (
							<ModalAdder key={key} modalElement={<BusLocation busStop={busStop} busNumber={service.ServiceNo} nextBus={service.NextBus} busStopLocation={busStopData.Location} />}>
								<BusDetails
									key={key}
									busNumber={service.ServiceNo}
									details={service}
								/>
							</ModalAdder>
						);
					}
				)
			) : (
				<Text>No bus stop data found</Text>
			)}
		</View>
	);
};

export default BusStop;
