import React from "react";
import GoingHome from "../../screens/GoingHome";
import { render } from "@testing-library/react-native";

jest.mock("react-native-gesture-handler", () => {
	// eslint-disable-next-line global-require
	const View = require("react-native/Libraries/Components/View/View");
	const ScrollViewMock = require("react-native/Libraries/Components/ScrollView/ScrollView");
	return {
		Swipeable: View,
		DrawerLayout: View,
		State: {},
		// This is needed to not error out below in the tests
		ScrollView: ScrollViewMock,
		Slider: View,
		Switch: View,
		// TextInput: View,
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

jest.mock("../../api/api.ts", () => ({
	GetBusStopByCode: jest.fn().mockImplementation((code) => {
		Promise.resolve({ Description: "", RoadName: "", Code: code });
	}),
	GetBusStop: jest.fn().mockImplementation((code) => {
		Promise.resolve(null);
	}),
}));

describe("Home", () => {
	it("renders properly", () => {
		const screen = render(<GoingHome />).toJSON();
		expect(screen).toMatchSnapshot();
	});

	it("renders list of bus stops properly", () => {
		const settings = {
			GoingHome: [44221],
		};

		const screen = render(<GoingHome settings={settings} />).toJSON();
		expect(screen).toMatchSnapshot();
	});
});
