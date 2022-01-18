import React, { useState, useRef, useEffect } from "react";
import { Header, Text } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyles from "../../assets/css/AppStyles";
import * as Location from "expo-location";
import { Button } from "react-native-elements/dist/buttons/Button";

const BusLocation = ({ busNumber, nextBus }) => {
	const [busRegion, setBusRegion] = useState({
		latitude: nextBus !== null ? parseFloat(nextBus.Latitude) : 1,
		longitude: nextBus !== null ? parseFloat(nextBus.Longitude) : 100,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	});
	const mapRef = useRef(null);

	useEffect(() => {
		(async () => {
            
		})();
	}, []);

	return (
		<SafeAreaView>
			<Header
				backgroundColor={AppStyles.headerAlternative.backgroundColor}
				centerComponent={
					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							fontSize: 18,
						}}
					>
						Oi, where is Bus {busNumber} leh?
					</Text>
				}
			></Header>
			<MapView
				ref={mapRef}
				provider={PROVIDER_GOOGLE}
				style={{
					height: 250,
					width: 400,
				}}
				region={busRegion}
			>
				<Marker
					coordinate={busRegion}
				></Marker>
			</MapView>
		</SafeAreaView>
	);
};

export default BusLocation;
