import ReactTestRenderer, { create } from "react-test-renderer";
import { render } from "@testing-library/react-native";
import React from "react";
import GoingHome from "../../screens/GoingHome";

// jest.mock("react-navigation", () => ({
// 	NavigationEvents: "mockNavigationEvents",
// }));

jest.mock("react-native-gesture-handler", () => {
	// eslint-disable-next-line global-require
	const View = require("react-native/Libraries/Components/View/View");
	return {
		Swipeable: View,
		DrawerLayout: View,
		State: {},
		ScrollView: View,
		Slider: View,
		Switch: View,
		TextInput: View,
		ToolbarAndroid: View,
		ViewPagerAndroid: View,
		DrawerLayoutAndroid: View,
		WebView: View,
		NativeViewGestureHandler: View,
		TapGestureHandler: View,
		FlingGestureHandler: View,
		ForceTouchGestureHandler: View,
		LongPressGestureHandler: View,
		PanGestureHandler: View,
		PinchGestureHandler: View,
		RotationGestureHandler: View,
		/* Buttons */
		RawButton: View,
		BaseButton: View,
		RectButton: View,
		BorderlessButton: View,
		/* Other */
		FlatList: View,
		gestureHandlerRootHOC: jest.fn(),
		Directions: {},
	};
});

describe("Home", () => {
	it("renders properly", () => {
		// const testRenderer = ReactTestRenderer.create(<GoingHome />);
		// expect(testRenderer.toJSON()).toMatchSnapshot();
		// render(<GoingHome />)
		let root = create(<GoingHome />);
		expect(root.toJSON()).toMatchSnapshot();
	});
});
