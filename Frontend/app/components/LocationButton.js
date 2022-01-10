import React from "react";
import { Icon } from "react-native-elements";
import { FloatingAction } from "react-native-floating-action";

export const LocationButton = ({ onPress }) => {
	return (
		<FloatingAction
			color="darkred"
			showBackground={false}
			distanceToEdge={{ horizontal: 15, vertical: 150 }}
			onPressMain={onPress}
			floatingIcon={<Icon name="gps-fixed" color={"white"} />}
		/>
	);
};

export default LocationButton;
