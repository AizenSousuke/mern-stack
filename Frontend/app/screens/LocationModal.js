import React from "react";
import { View, Text, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import * as config from "../../config/default.json";

MapboxGL.setAccessToken(config.MAPBOX);

export const LocationModal = () => {
	return (
		<ScrollView>
			<MapboxGL.MapView style={{ flex: 1 }} />
		</ScrollView>
	);
};

export default LocationModal;
