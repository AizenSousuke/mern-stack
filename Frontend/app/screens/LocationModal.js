import React, { useState, useEffect, createRef, useRef } from "react";
import { View, Text, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as config from "../../config/default.json";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export const LocationModal = () => {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

	const mapRef = useRef(null);

	useEffect(() => {
		(async () => {
			// await GetLocation();
		})();
	}, []);

	const GetLocation = async () => {
		console.log(Object.keys(mapRef.current));		
		console.log('mapRef.current.animateToRegion => ', typeof mapRef.current.animateToRegion);

		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		setLocation(location);

		mapRef?.current?.animateToRegion({
			latitude: location.latitude,
			longitude: location.longitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01,
		}, 100);

		console.log("Location set: " + JSON.stringify(location));
	};

	return (
		<ScrollView>
			<MapView
				ref={mapRef}
				provider={PROVIDER_GOOGLE}
				style={{
					height: 300,
					width: 400,
					justifyContent: "flex-end",
					alignItems: "center",
				}}
				onMapReady={() => GetLocation()}
				showsUserLocation={true}
			></MapView>
		</ScrollView>
	);
};

export default LocationModal;
