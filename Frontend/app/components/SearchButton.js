import React from "react";
import { Icon } from "react-native-elements";
import { FloatingAction } from "react-native-floating-action";
import ColourScheme from "../settings/ColourScheme.json";

export const SearchButton = ({ onPress }) => {
	return (
		<FloatingAction
			color={ColourScheme.secondary}
			showBackground={false}
			distanceToEdge={{ horizontal: 15, vertical: 80 }}
			onPressMain={onPress}
			floatingIcon={<Icon name="search" color={"white"} />}
		/>
	);
};

export default SearchButton;
