import React, { useState, useEffect, createRef, useRef } from "react";
import { View, Text, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as config from "../../config/default.json";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import * as API from "../api/api";
import BusStopListPureComponent from "../components/BusStopListPureComponent";

export const LocationModal = () => {
	const [location, setLocation] = useState({
		latitude: 1.3,
		longitude: 103.7,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	});
	const [nearbyBusStops, setNearbyBusStops] = useState([]);

	const mapRef = useRef(null);
	const markerRef = useRef([]);

	useEffect(() => {
		(async () => {
			await GetLocation().then(async (loc) => {
				if (loc) {
					// console.log("Loc: " + JSON.stringify(loc));
					// console.log("Getting nearby bus stops");
					// Get nearby bus stops
					const stops = await API.GetNearbyBusStop(
						loc.longitude,
						loc.latitude
					);

					if (stops.busStopsNearby) {
						// console.log(
						// 	"There are nearby bus stops: " +
						// 		stops.busStopsNearby.length
						// );
						setNearbyBusStops(stops.busStopsNearby);
					}
				}
			});
		})();
	}, []);

	const GetLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			ToastAndroid.show("Unable to access location", ToastAndroid.SHORT);
			return;
		}

		const region = await Location.getCurrentPositionAsync({}).then(
			(loc) => {
				setLocation({
					latitude: loc.coords?.latitude,
					longitude: loc.coords?.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				});
				mapRef.current?.animateToRegion({
					latitude: loc.coords?.latitude,
					longitude: loc.coords?.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				});

				// console.log("Location set: " + JSON.stringify(loc));
				return {
					latitude: loc.coords?.latitude,
					longitude: loc.coords?.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				};
			}
		);
		return region;
	};

	return (
		<>
			<View>
				{location ? (
					<MapView
						ref={mapRef}
						provider={PROVIDER_GOOGLE}
						style={{
							height: 250,
							width: 400,
							justifyContent: "flex-end",
							alignItems: "center",
						}}
						region={location}
						showsUserLocation={true}
						maxZoomLevel={17}
					>
						{nearbyBusStops &&
							nearbyBusStops.map((marker, index) => (
								<Marker
									key={index}
									identifier={marker.Description}
									ref={(elem) =>
										(markerRef.current[index] = elem)
									}
									title={marker.Description}
									coordinate={{
										longitude: marker.Location[0],
										latitude: marker.Location[1],
									}}
								/>
							))}
					</MapView>
				) : (
					<Text>No map loaded. {errorMsg}</Text>
				)}
			</View>
			<ScrollView>
				{nearbyBusStops.length > 0
					? nearbyBusStops.map((stop, key) => (
							<BusStopListPureComponent
								key={key}
								name={stop.Description}
								address={stop.RoadName}
								code={stop.BusStopCode}
								CollapseEvent={(code) => {
									// console.log("Collapse event triggered: " + stop.Description);
									mapRef.current?.fitToSuppliedMarkers([
										stop.Description,
									]);
									markerRef.current[key].showCallout();
								}}
							/>
					  ))
					: null}
			</ScrollView>
		</>
	);
};

export default LocationModal;
