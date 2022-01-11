import React, { useState, useEffect, createRef, useRef } from "react";
import { View, Text, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as config from "../../config/default.json";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { ToastAndroid } from "react-native";

export const LocationModal = () => {
	const [location, setLocation] = useState({
		latitude: 1.3,
		longitude: 103.7,
		latitudeDelta: 1,
		longitudeDelta: 1,
	});

	const mapRef = useRef(null);

	useEffect(() => {
		(async () => {
			await GetLocation();
		})();
	}, []);

	const GetLocation = async () => {
		// console.log(Object.keys(mapRef.current));
		// console.log(
		// 	"mapRef.current.animateToRegion => ",
		// 	typeof mapRef.current.animateToRegion
		// );

		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			ToastAndroid.show("Unable to access location", ToastAndroid.SHORT);
			return;
		}

		await Location.getCurrentPositionAsync({}).then((loc) => {
			setLocation(loc);
			mapRef.current?.animateToRegion({
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			});

			console.log("Location set: " + JSON.stringify(loc));
		});
	};

	return (
		<ScrollView>
			{location ? (
				<MapView
					ref={mapRef}
					provider={PROVIDER_GOOGLE}
					style={{
						height: 300,
						width: 400,
						justifyContent: "flex-end",
						alignItems: "center",
					}}
					region={location}
					showsUserLocation={true}
				></MapView>
			) : (
				<Text>No map loaded. {errorMsg}</Text>
			)}
		</ScrollView>
	);
};

export default LocationModal;
