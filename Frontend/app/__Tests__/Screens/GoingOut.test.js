import React from "react";
import GoingOut from "../../screens/GoingOut";
import { act, render } from "@testing-library/react-native";
import { create } from "react-test-renderer";

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

jest.mock("../../api/api.ts");

describe("GoingOut", () => {
	it("renders properly according to snapshot", () => {
		const screen = render(<GoingOut />).toJSON();
		expect(screen).toMatchSnapshot();
	});

	it("renders list of bus stops properly according to snapshot", async () => {
		const settings = {
			GoingOut: [44221],
		};

		await act(async () => {
			const screen = (
				await create(<GoingOut settings={settings} />)
			).toJSON();
			expect(screen).toMatchSnapshot();
		});
	});
});
