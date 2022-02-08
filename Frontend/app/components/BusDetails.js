import moment from "moment";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";
import AppStyles from "../../assets/css/AppStyles";
import BusLocation from "./BusLocation";
import BusInformation from "./BusInformation";
import ModalAdder from "./ModalAdder";

const GetValueForLoad = (load) => {
	switch (load) {
		case "SEA":
			return 0.2;
		case "SDA":
			return 0.6;
		default:
			return 0.9;
	}
};

const GetColorForLoad = (load) => {
	switch (load) {
		case "SEA":
			return "green";
		case "SDA":
			return "orange";
		default:
			return "red";
	}
};

const GetEstimatedArrivalMinute = (estimatedArrivalTime) => {
	var timeNow = moment().utcOffset("+08:00").format();
	var time1 = moment(timeNow);
	var time2 = moment(estimatedArrivalTime);
	// console.log("Time now: " + timeNow);
	// console.log("Time bus is reaching: " + estimatedArrivalTime);
	var timeEstimatedArrival = time2.diff(time1, "minutes");
	// console.log("Time estimated arrival: " + timeEstimatedArrival);

	if (parseInt(timeEstimatedArrival) > 2) {
		return timeEstimatedArrival + " min";
	} else {
		return "Arrived";
	}
};

const BusDetails = ({ busStop, busStopData, busNumber, details }) => {
	// console.log("Details: " + JSON.stringify(details));

	const [number, setNumber] = useState(busNumber);
	const [data, setData] = useState(details);

	useEffect(() => {
		setNumber(busNumber);
		setData(details);
	}, [busNumber, details]);

	return (
		<View style={AppStyles.busDetails}>
			<ModalAdder modalElement={<BusInformation busNumber={number} />}>
				<View style={{ flexDirection: "row", flex: 1 }}>
					<Text style={[AppStyles.busNumber]}>
						{number}
					</Text>
				</View>
			</ModalAdder>
			<ModalAdder
				modalElement={
					<BusLocation
						busStop={busStop}
						busNumber={details.ServiceNo}
						nextBus={details.NextBus}
						busStopLocation={busStopData.Location}
					/>
				}
				style={{
					flex: 0.8,
					flexDirection: "row",
					justifyContent: "space-around",
				}}
			>
				<View style={{ flexDirection: "column" }}>
					{data.NextBus.Load !== "" ? (
						<>
							<Text style={AppStyles.busType}>
								{data.NextBus.Type == "DD" ? "Double" : ""}
							</Text>
							<Progress.Bar
								progress={GetValueForLoad(data.NextBus.Load)}
								color={GetColorForLoad(data.NextBus.Load)}
								width={50}
							/>
							<Text style={AppStyles.estimatedArrival}>
								{GetEstimatedArrivalMinute(
									data.NextBus.EstimatedArrival
								).toString()}
							</Text>
						</>
					) : (
						<Text style={AppStyles.noData}>No Data</Text>
					)}
				</View>
				<View style={{ flexDirection: "column" }}>
					{data.NextBus2.Load !== "" ? (
						<>
							<Text style={AppStyles.busType}>
								{data.NextBus2.Type == "DD" ? "Double" : ""}
							</Text>
							<Progress.Bar
								progress={GetValueForLoad(data.NextBus2.Load)}
								color={GetColorForLoad(data.NextBus2.Load)}
								width={50}
							/>
							<Text style={AppStyles.estimatedArrival}>
								{GetEstimatedArrivalMinute(
									data.NextBus2.EstimatedArrival
								).toString()}
							</Text>
						</>
					) : (
						<Text style={AppStyles.noData}>No Data</Text>
					)}
				</View>
				<View style={{ flexDirection: "column" }}>
					{data.NextBus3.Load !== "" ? (
						<>
							<Text style={AppStyles.busType}>
								{data.NextBus2.Type == "DD" ? "Double" : ""}
							</Text>
							<Progress.Bar
								progress={GetValueForLoad(data.NextBus3.Load)}
								color={GetColorForLoad(data.NextBus3.Load)}
								width={50}
							/>
							<Text style={AppStyles.estimatedArrival}>
								{GetEstimatedArrivalMinute(
									data.NextBus3.EstimatedArrival
								).toString()}
							</Text>
						</>
					) : (
						<Text style={AppStyles.noData}>No Data</Text>
					)}
				</View>
			</ModalAdder>
		</View>
	);
};

export default BusDetails;
