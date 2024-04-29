import React from "react";
import { Icon } from "react-native-elements";
import { FloatingAction } from "react-native-floating-action";
import ColourScheme from "../settings/colourScheme.json";

export const LocationButton = ({ onPress }: { onPress: () => void }) => {
	return (
		<FloatingAction
			color={ColourScheme.secondary}
			showBackground={false}
			distanceToEdge={{ horizontal: 15, vertical: 150 }}
			onPressMain={onPress}
			floatingIcon={<Icon name="gps-fixed" color={"white"} tvParallaxProperties={undefined} />}
		/>
	);
};

export default LocationButton;
