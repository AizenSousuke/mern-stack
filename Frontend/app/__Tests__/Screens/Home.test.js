import ReactTestRenderer, { create } from "react-test-renderer";
import { render } from "@testing-library/react-native";
import React from "react";
import GoingHome from "../../screens/GoingHome";
import { GetBusStopByCode, GetBusStop } from "../../api/api";

jest.mock("react-native-gesture-handler", () => {
	// eslint-disable-next-line global-require
	const View = require("react-native/Libraries/Components/View/View");
	return {
		Swipeable: View,
		DrawerLayout: View,
		State: {},
		// This is needed to not error out below in the tests
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
		Icon: View
	};
});

jest.mock("../../api/api.js", () => ({
	GetBusStopByCode: jest.fn(),
	GetBusStop: jest.fn()
}));

GetBusStopByCode.mockImplementation((code) => {
	Promise.resolve({ Description: "", RoadName: "", Code: code });
});

GetBusStop.mockImplementation((code) => {
	Promise.resolve(null);
})

describe("Home", () => {
	it("renders properly", () => {
		// const testRenderer = ReactTestRenderer.create(<GoingHome />);
		// expect(testRenderer.toJSON()).toMatchSnapshot();

		// expect(render(<GoingHome />).toJSON()).toMatchSnapshot();

		let root = create(<GoingHome />);
		expect(root.toJSON()).toMatchSnapshot();
	});

	it("renders list of bus stops properly", () => {
		const settings = {
			GoingHome: [44229],
		};
		let root = create(<GoingHome settings={settings} />);
		expect(root.toJSON()).toMatchSnapshot();
	});
});
