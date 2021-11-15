import React from "react";
import { Icon } from "react-native-elements";
import { FloatingAction } from "react-native-floating-action";

const SearchButton = ({ onPress }) => {
	return (
		<FloatingAction
			showBackground={false}
			distanceToEdge={{ horizontal: 15, vertical: 80 }}
			onPressMain={onPress}
			floatingIcon={<Icon name="search" color={"white"} />}
		/>
	);
};

export default SearchButton;
